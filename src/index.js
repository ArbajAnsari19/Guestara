import express from 'express';
import { PrismaClient } from '@prisma/client';

// Initialize the Express application and Prisma client
const app = express();
const prisma = new PrismaClient();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// POST endpoint to create a new category
app.post('/categories', async (req, res) => {
    const { name, image, description, taxApplicability, tax, taxType } = req.body;
    try {
      // Use Prisma client to insert a new category into the database
      const category = await prisma.category.create({
        data: {
          name,
          image,
          description,
          taxApplicability,
          tax,
          taxType
        }
      });
      // Send back the newly created category with a 201 status code
      res.status(201).json(category);
    } catch (error) {
      // Handle any errors that occur during the database operation
      res.status(500).json({ error: error.message });
    }
});

// GET endpoint to retrieve all categories and their nested subcategories and items
app.get('/categories', async (req, res) => {
    try {
      const categories = await prisma.category.findMany({
        include: {
          subCategories: {
            include: {
              items: true
            }
          },
          items: true // Include items directly under the category
        }
      });
      // Send back all categories with a 200 status code
      res.status(200).json(categories);
    } catch (error) {
      // Handle any errors that occur during the database operation
      res.status(500).json({ error: error.message });
    }
});

// GET endpoint to retrieve a single category by its ID
app.get('/categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const category = await prisma.category.findUnique({
        where: { id: parseInt(id) },
        include: {
          subCategories: {
            include: {
              items: true
            }
          },
          items: true
        }
      });
      // Check if the category was found and respond accordingly
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).send('Category not found');
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// PUT endpoint to update a category by its ID
app.put('/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { name, image, description, taxApplicability, tax, taxType } = req.body;
    try {
      // Use Prisma client to update the category in the database
      const category = await prisma.category.update({
        where: { id: parseInt(id) },
        data: {
          name,
          image,
          description,
          taxApplicability,
          tax,
          taxType
        }
      });
      // Send back the updated category with a 200 status code
      res.status(200).json(category);
    } catch (error) {
      // Handle any errors that occur during the database operation
      res.status(500).json({ error: error.message });
    }
});

// DELETE endpoint to remove a category by its ID
app.delete('/categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
      // Use Prisma client to delete the category from the database
      await prisma.category.delete({
        where: { id: parseInt(id) }
      });
      // Send back a 204 status code to indicate successful deletion without content
      res.status(204).send();
    } catch (error) {
      // Handle any errors that occur during the database operation
      res.status(500).json({ error: error.message });
    }
});

// POST endpoint to create a new subcategory under a specific category
app.post('/categories/:categoryId/subcategories', async (req, res) => {
    const { categoryId } = req.params;
    const { name, image, description, taxApplicability, tax } = req.body;
    try {
      // Use Prisma client to insert a new subcategory linked to a category into the database
      const subCategory = await prisma.subCategory.create({
        data: {
          name,
          image,
          description,
          taxApplicability,
          tax,
          category: { connect: { id: parseInt(categoryId) } }
        }
      });
      // Send back the newly created subcategory with a 201 status code
      res.status(201).json(subCategory);
    } catch (error) {
      // Handle any errors that occur during the database operation
      res.status(500).json({ error: error.message });
    }
});

// Endpoint to get a list of all subcategories with their associated categories and items
app.get('/subcategories', async (req, res) => {
    try {
      // Fetch all subcategories from the database, including related category and items
      const subCategories = await prisma.subCategory.findMany({
        include: {
          category: true,  // Include the related category information
          items: true      // Include all items under each subcategory
        }
      });
      res.status(200).json(subCategories); // Respond with the list of subcategories
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle and respond with errors if any occur
    }
  });

// Endpoint to get a specific subcategory by its ID
app.get('/subcategories/:id', async (req, res) => {
    const { id } = req.params; // Extract subcategory ID from request parameters
    try {
      // Fetch a specific subcategory by ID, including related category and items
      const subCategory = await prisma.subCategory.findUnique({
        where: { id: parseInt(id) }, // Use ID from request params to find the subcategory
        include: {
          category: true,  // Include the related category information
          items: true      // Include all items under the subcategory
        }
      });
      if (subCategory) {
        res.status(200).json(subCategory); // Respond with the found subcategory
      } else {
        res.status(404).send('SubCategory not found'); // Respond with a 404 status if subcategory is not found
      }
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle and respond with errors if any occur
    }
  });

// Endpoint to update a specific subcategory by its ID
app.put('/subcategories/:id', async (req, res) => {
    const { id } = req.params; // Extract subcategory ID from request parameters
    const { name, image, description, taxApplicability, tax } = req.body; // Extract data from request body
    try {
      // Update the subcategory with new data
      const subCategory = await prisma.subCategory.update({
        where: { id: parseInt(id) }, // Use ID from request params to find the subcategory
        data: {
          name,
          image,
          description,
          taxApplicability,
          tax
        }
      });
      res.status(200).json(subCategory); // Respond with the updated subcategory
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle and respond with errors if any occur
    }
  });

// Endpoint to delete a specific subcategory by its ID
app.delete('/subcategories/:id', async (req, res) => {
    const { id } = req.params; // Extract subcategory ID from request parameters
    try {
      // Delete the subcategory from the database
      await prisma.subCategory.delete({
        where: { id: parseInt(id) } // Use ID from request params to delete the subcategory
      });
      res.status(204).send(); // Respond with a 204 status indicating successful deletion
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle and respond with errors if any occur
    }
  });

// Endpoint to create a new item
app.post('/items', async (req, res) => {
    const { name, image, description, taxApplicability, tax, baseAmount, discount, totalAmount, categoryId, subCategoryId } = req.body; // Extract data from request body
    try {
      // Create a new item with provided data and associate it with category and/or subcategory if IDs are provided
      const item = await prisma.item.create({
        data: {
          name,
          image,
          description,
          taxApplicability,
          tax,
          baseAmount,
          discount,
          totalAmount,
          category: categoryId ? { connect: { id: parseInt(categoryId) } } : undefined, // Associate with category if ID is provided
          subCategory: subCategoryId ? { connect: { id: parseInt(subCategoryId) } } : undefined // Associate with subcategory if ID is provided
        }
      });
      res.status(201).json(item); // Respond with the created item
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle and respond with errors if any occur
    }
  });

// Endpoint to get a list of all items with their associated categories and subcategories
app.get('/items', async (req, res) => {
    try {
      // Fetch all items from the database, including related category and subcategory information
      const items = await prisma.item.findMany({
        include: {
          category: true,    // Include the related category information
          subCategory: true  // Include the related subcategory information
        }
      });
      res.status(200).json(items); // Respond with the list of items
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle and respond with errors if any occur
    }
  });

// Endpoint to get a specific item by its ID
app.get('/items/:id', async (req, res) => {
    const { id } = req.params; // Extract item ID from request parameters
    try {
      // Fetch a specific item by ID, including related category and subcategory information
      const item = await prisma.item.findUnique({
        where: { id: parseInt(id) }, // Use ID from request params to find the item
        include: {
          category: true,    // Include the related category information
          subCategory: true  // Include the related subcategory information
        }
      });
      if (item) {
        res.status(200).json(item); // Respond with the found item
      } else {
        res.status(404).send('Item not found'); // Respond with a 404 status if item is not found
      }
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle and respond with errors if any occur
    }
  });

// Endpoint to update a specific item by its ID
app.put('/items/:id', async (req, res) => {
    const { id } = req.params; // Extract item ID from request parameters
    const { name, image, description, taxApplicability, tax, baseAmount, discount, totalAmount } = req.body; // Extract data from request body
    try {
      // Update the item with new data
      const item = await prisma.item.update({
        where: { id: parseInt(id) }, // Use ID from request params to find the item
        data: {
          name,
          image,
          description,
          taxApplicability,
          tax,
          baseAmount,
          discount,
          totalAmount
        }
      });
      res.status(200).json(item); // Respond with the updated item
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle and respond with errors if any occur
    }
  });

// Endpoint to delete a specific item by its ID
app.delete('/items/:id', async (req, res) => {
    const { id } = req.params; // Extract item ID from request parameters
    try {
      // Delete the item from the database
      await prisma.item.delete({
        where: { id: parseInt(id) } // Use ID from request params to delete the item
      });
      res.status(204).send(); // Respond with a 204 status indicating successful deletion
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle and respond with errors if any occur
    }
  });

// Endpoint to search for items by name
app.get('/items/search', async (req, res) => {
    const { query } = req.query; // Extract search query from request query parameters
    try {
      // Find items where the name contains the search query, case-insensitive
      const items = await prisma.item.findMany({
        where: {
          name: {
            contains: query, // Search for items containing the query string in the name
            mode: 'insensitive' // Perform case-insensitive search
          }
        }
      });
      res.status(200).json(items); // Respond with the list of matching items
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle and respond with errors if any occur
    }
  });

// Start the server and listen on the specified port
app.listen(port, () => {    
    console.log(`Server is running on http://localhost:${port}`); // Log the server URL to the console
});
