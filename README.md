# Menu Management Backend Server

This is a Node.js backend server for managing menus, structured into three hierarchical levels: Categories, Sub-Categories, and Items. The project uses Prisma ORM with PostgreSQL as the database and is built with Express and Node.js.

## Features

- **Category Management:** Create, update, delete, and fetch categories.
- **Sub-Category Management:** Each category can have multiple sub-categories.
- **Item Management:** Each sub-category can have multiple items.
- **CRUD Operations:** Full CRUD (Create, Read, Update, Delete) support for categories, sub-categories, and items.
- **Database:** PostgreSQL with Prisma ORM for seamless database interactions.
- **API Testing:** Easily testable via Postman.

## Prerequisites

- Node.js
- PostgreSQL
- Prisma CLI

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/menu-management-backend.git
   cd menu-management-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add your PostgreSQL database credentials:

   ```
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
   ```

4. **Migrate the database:**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the server:**

   ```bash
   node src/index.js
   ```

   The server will start on `http://localhost:3000`.

## API Endpoints

Here are the key API endpoints for managing the menu:

### Category

- **GET /categories** - Get all categories
- **POST /categories** - Create a new category
- **GET /categories/:id** - Get a specific category
- **PUT /categories/:id** - Update a category
- **DELETE /categories/:id** - Delete a category

### Sub-Category

- **GET /categories/:categoryId/subcategories** - Get all sub-categories under a category
- **POST /categories/:categoryId/subcategories** - Create a new sub-category under a category
- **GET /subcategories/:id** - Get a specific sub-category
- **PUT /subcategories/:id** - Update a sub-category
- **DELETE /subcategories/:id** - Delete a sub-category

### Items

- **GET /subcategories/:subcategoryId/items** - Get all items under a sub-category
- **POST /subcategories/:subcategoryId/items** - Create a new item under a sub-category
- **GET /items/:id** - Get a specific item
- **PUT /items/:id** - Update an item
- **DELETE /items/:id** - Delete an item

## Usage

You can use [Postman](https://www.postman.com/) to test the API endpoints.

## Project Structure

```
│   .env                # Environment variables
├───prisma
│   └── schema.prisma   # Prisma schema definition
├───src
│   └── index.js        # Entry point of the application
```

## Technologies Used

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- Postman (for API testing)

Feel free to customize this README further based on your specific setup or additional features.
