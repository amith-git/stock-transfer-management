"use server"
import prisma from "./db";
import { revalidatePath } from "next/cache";

export async function getWarehouses() {
  try { return await prisma.warehouse.findMany({ orderBy: { name: 'asc' } }); } 
  catch (error) { return []; }
}

export async function getTransfers() {
  try {
    return await prisma.stockTransfer.findMany({
      include: { source: true, destination: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) { return []; }
}

export async function createWarehouse(name: string, stock: number) {
  try {
    if (stock < 0) return { error: "Stock cannot be negative." };
    const existing = await prisma.warehouse.findUnique({ where: { name } });
    if (existing) return { error: "A warehouse with this name already exists." };

    await prisma.warehouse.create({ data: { name, stock } });
    revalidatePath("/");
    return { success: "Warehouse created successfully!" };
  } catch (error) {
    return { error: "Database Error: Could not create warehouse." };
  }
}

export async function createTransfer(sourceId: string, destinationId: string, quantity: number) {
  try {
    if (sourceId === destinationId) return { error: "Cannot transfer to the same warehouse." };
    if (quantity <= 0) return { error: "Transfer quantity must be greater than zero." };

    const source = await prisma.warehouse.findUnique({ where: { id: sourceId } });
    if (!source || source.stock < quantity) {
      return { error: "Not enough stock in the source warehouse." };
    }

    await prisma.stockTransfer.create({
      data: { sourceId, destinationId, quantity, status: "PENDING" }
    });
    revalidatePath("/");
    return { success: "Transfer requested successfully!" };
  } catch (error) {
    return { error: "Database Error: Could not request transfer." };
  }
}

export async function completeTransfer(transferId: string) {
  try {
    const transfer = await prisma.stockTransfer.findUnique({ 
      where: { id: transferId }, 
      include: { source: true } 
    });
    
    if (!transfer || transfer.status !== "PENDING") return { error: "Invalid or already completed transfer." };

    if (transfer.source.stock < transfer.quantity) {
      await prisma.stockTransfer.update({
        where: { id: transferId },
        data: { status: "CANCELLED" }
      });
      revalidatePath("/");
      return { error: "Transfer cancelled: Source stock dropped below requested amount." };
    }

    await prisma.$transaction([
      prisma.warehouse.update({ where: { id: transfer.sourceId }, data: { stock: { decrement: transfer.quantity } } }),
      prisma.warehouse.update({ where: { id: transfer.destinationId }, data: { stock: { increment: transfer.quantity } } }),
      prisma.stockTransfer.update({ where: { id: transferId }, data: { status: "COMPLETED" } })
    ]);
    
    revalidatePath("/");
    return { success: "Transfer completed and stock updated!" };
  } catch (error) {
    return { error: "Database Error: Failed to complete transfer." };
  }
}

export async function deleteWarehouse(id: string) {
  try {
    await prisma.stockTransfer.deleteMany({ where: { OR: [{ sourceId: id }, { destinationId: id }] } });
    await prisma.warehouse.delete({ where: { id } });
    revalidatePath("/");
    return { success: "Warehouse deleted." };
  } catch (error) {
    return { error: "Database Error: Failed to delete warehouse." };
  }
}

export async function deleteTransfer(id: string) {
  try {
    await prisma.stockTransfer.delete({ where: { id } });
    revalidatePath("/");
    return { success: "Transfer record deleted." };
  } catch (error) {
    return { error: "Database Error: Failed to delete transfer." };
  }
}