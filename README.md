# Stock Transfer Management

![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_|_TypeScript_|_Prisma_|_PostgreSQL-black?style=for-the-badge)

## Links
- **Live Application URL:** [https://stock-transfer-management-theta.vercel.app](https://stock-transfer-management-theta.vercel.app)
- **GitHub Repository:** [https://github.com/amith-git/stock-transfer-management](https://github.com/amith-git/stock-transfer-management)

## Tech Stack
- Next.js (App Router), TypeScript, Tailwind CSS
- Prisma ORM & PostgreSQL (Neon)

## Setup Steps (Local)
1. Clone the repository.
2. Install dependencies: `npm install`
3. Add your database connection string to a `.env` file: `DATABASE_URL="..."`
4. Sync the database: `npx prisma db push`
5. Run the server: `npm run dev`

## 🧪 Test Flow & Sample Usage
1. **Create Warehouses:** Navigate to the main dashboard. Under "Create Warehouse & Stock", generate two distinct warehouses (e.g., *Warehouse A* with `100` stock, *Warehouse B* with `0` stock).
2. **Initiate Transfer:** Under "Create Transfer Request", select *Warehouse A* as the source, *Warehouse B* as the destination, input a valid quantity, and click **Request**.
3. **Complete Transfer:** Locate your `PENDING` request in the Transfer Status Management table and click **Complete**. 
4. **Verification:** Observe that stock levels immediately update atomically, backed by visual success/error flash banners preventing bad data states.
5. **Delete Record:** Once a transfer is complete (or if you want to clear a pending one), you can delete the transfer record from the history table to keep your dashboard clean.
