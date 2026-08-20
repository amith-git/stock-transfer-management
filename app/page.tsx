import { getWarehouses, getTransfers, createWarehouse, createTransfer, completeTransfer, deleteWarehouse, deleteTransfer } from "./actions";
import { redirect } from "next/navigation";

export default async function Home(props: { searchParams: Promise<{ error?: string, success?: string }> }) {
  const searchParams = await props.searchParams;
  const warehouses = await getWarehouses();
  const transfers = await getTransfers();

  return (
    <div className="p-8 font-sans max-w-5xl mx-auto text-black bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Stock Transfer Management</h1>
      
      {/* --- FLASH MESSAGES --- */}
      {searchParams.error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm">
          <strong>Error:</strong> {searchParams.error}
        </div>
      )}
      {searchParams.success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-sm">
          <strong>Success:</strong> {searchParams.success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Section 1: Create Warehouse */}
        <section className="border p-6 rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">1. Create Warehouse & Stock</h2>
          <form action={async (formData) => {
            "use server";
            const name = formData.get("name") as string;
            const stock = Number(formData.get("stock"));
            const res = await createWarehouse(name, stock);
            if (res?.error) redirect(`/?error=${encodeURIComponent(res.error)}`);
            if (res?.success) redirect(`/?success=${encodeURIComponent(res.success)}`);
          }} className="flex flex-col gap-3">
            <input name="name" placeholder="Warehouse Name (e.g. New York)" required className="border p-2 rounded" />
            <input name="stock" type="number" placeholder="Initial Stock Quantity" required className="border p-2 rounded" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create</button>
          </form>
        </section>

        {/* Section 2: Current Stock Levels */}
        <section className="border p-6 rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Current Stock Levels</h2>
          <ul className="space-y-2">
            {warehouses.length === 0 ? <p className="text-gray-500">No warehouses yet.</p> : null}
            {warehouses.map(w => (
              <li key={w.id} className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">{w.name}</span>
                <div className="flex items-center gap-3">
                  <span className="bg-gray-200 px-2 rounded">Stock: {w.stock}</span>
                  <form action={async () => {
                    "use server";
                    const res = await deleteWarehouse(w.id);
                    if (res?.error) redirect(`/?error=${encodeURIComponent(res.error)}`);
                    if (res?.success) redirect(`/?success=${encodeURIComponent(res.success)}`);
                  }}>
                    <button type="submit" className="text-red-500 font-bold hover:text-red-700">X</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 3: Create Transfer Request */}
        <section className="border p-6 rounded-lg shadow-sm bg-gray-50 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">2. Create Transfer Request</h2>
          <form action={async (formData) => {
            "use server";
            const source = formData.get("sourceId") as string;
            const dest = formData.get("destinationId") as string;
            const qty = Number(formData.get("quantity"));
            const res = await createTransfer(source, dest, qty);
            if (res?.error) redirect(`/?error=${encodeURIComponent(res.error)}`);
            if (res?.success) redirect(`/?success=${encodeURIComponent(res.success)}`);
          }} className="flex flex-col md:flex-row gap-4">
            <select name="sourceId" required className="border p-2 rounded flex-1">
              <option value="">Select Source Warehouse...</option>
              {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
            <select name="destinationId" required className="border p-2 rounded flex-1">
              <option value="">Select Destination Warehouse...</option>
              {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
            <input name="quantity" type="number" placeholder="Qty" required className="border p-2 rounded w-24" />
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Request</button>
          </form>
        </section>

        {/* Section 4: Transfer History & Status */}
        <section className="border p-6 rounded-lg shadow-sm bg-gray-50 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">3. Transfer Status Management</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="pb-2">From</th>
                <th className="pb-2">To</th>
                <th className="pb-2">Qty</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {transfers.length === 0 ? <tr><td colSpan={5} className="py-4 text-gray-500 text-center">No transfers yet.</td></tr> : null}
              {transfers.map(t => (
                <tr key={t.id} className="border-b">
                  <td className="py-3">{t.source?.name || "Deleted"}</td>
                  <td>{t.destination?.name || "Deleted"}</td>
                  <td>{t.quantity}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-sm ${t.status === 'COMPLETED' ? 'bg-green-200' : (t.status === 'CANCELLED' ? 'bg-red-200' : 'bg-yellow-200')}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="flex gap-2 py-3">
                    {t.status === "PENDING" && (
                      <form action={async () => {
                        "use server";
                        const res = await completeTransfer(t.id);
                        if (res?.error) redirect(`/?error=${encodeURIComponent(res.error)}`);
                        if (res?.success) redirect(`/?success=${encodeURIComponent(res.success)}`);
                      }}>
                        <button type="submit" className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800">Complete</button>
                      </form>
                    )}
                    <form action={async () => {
                      "use server";
                      const res = await deleteTransfer(t.id);
                      if (res?.error) redirect(`/?error=${encodeURIComponent(res.error)}`);
                      if (res?.success) redirect(`/?success=${encodeURIComponent(res.success)}`);
                    }}>
                      <button type="submit" className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

      </div>
    </div>
  );
}