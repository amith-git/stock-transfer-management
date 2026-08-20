# Stock Transfer Management

![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js_|_TypeScript_|_Prisma_|_PostgreSQL-black?style=for-the-badge)

## Links
- **Live Application URL:** [Will add after Vercel deployment]
- **GitHub Repository:** [Will add after GitHub push]

## Tech Stack
- Next.js (App Router), TypeScript, Tailwind CSS
- Prisma ORM & PostgreSQL (Neon)

## Setup Steps (Local)
1. Clone the repository.
2. Install dependencies: `npm install`
3. Add your database connection string to a `.env` file: `DATABASE_URL="..."`
4. Sync the database: `npx prisma db push`
5. Run the server: `npm run dev`

## Sample Usage / Test Flow
1. **Create Warehouses:** Navigate to the main dashboard. Under "Create Warehouse & Stock", create two warehouses (e.g., Warehouse A with 100 stock, Warehouse B with 0 stock).
2. **Initiate Transfer:** Under "Create Transfer Request", select Warehouse A as the source, Warehouse B as the destination, and input a quantity. Click "Request".
3. **Complete Transfer:** In the "Transfer Status Management" table, locate your PENDING request. Click "Complete". 
4. **Verification:** Observe that the current stock levels immediately update. Flash messages will confirm success or block invalid actions (like negative stock or duplicate names).