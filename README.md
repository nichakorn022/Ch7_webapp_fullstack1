# Menu API

This project implements the `menu` and `type` APIs from the assignment using
Express, Prisma, and MySQL.

## Setup

1. Install the dependencies from the project root:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set the MySQL host, port, username,
   password, and database name. Create that database in MySQL before continuing.
3. Create the tables from the Prisma schema:
   ```bash
   npm run db:push
   ```
4. Run the API tests:
   ```bash
   npm test
   ```
5. Start the API:
   ```bash
   npm run dev
   ```

The API listens on port `5000` by default:

- `/api/menu` — list, fetch by ID, create, update, and delete menu items.
- `/api/type` — list, fetch by ID, create, update, and delete menu types.

Each menu item uses `typeId` to refer to its type. Menu responses include the
related type.
