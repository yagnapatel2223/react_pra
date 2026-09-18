const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory data store for products
let products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
  { id: 2, name: 'Coffee Mug', price: 12.50, category: 'Home & Kitchen' }
];

// Helper function to generate unique IDs
const generateId = () => {
  return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
};

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET /api/products/:id - Get a single product
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({ message: `Product with ID ${id} not found.` });
  }
  
  res.json(product);
});

// POST /api/products - Create a new product
app.post('/api/products', (req, res) => {
  const { name, price, category } = req.body;
  
  if (!name || price === undefined || !category) {
    return res.status(400).json({ message: 'Please provide name, price, and category.' });
  }
  
  const newProduct = {
    id: generateId(),
    name,
    price: parseFloat(price),
    category
  };
  
  products.push(newProduct);
  res.status(201).json({
    message: 'Product created successfully',
    product: newProduct
  });
});

// PUT /api/products/:id - Update an existing product
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price, category } = req.body;
  
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({ message: `Product with ID ${id} not found.` });
  }
  
  const updatedProduct = {
    ...products[productIndex],
    ...(name && { name }),
    ...(price !== undefined && { price: parseFloat(price) }),
    ...(category && { category })
  };
  
  products[productIndex] = updatedProduct;
  
  res.json({
    message: 'Product updated successfully',
    product: updatedProduct
  });
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({ message: `Product with ID ${id} not found.` });
  }
  
  const deletedProduct = products.splice(productIndex, 1);
  
  res.json({
    message: 'Product deleted successfully',
    product: deletedProduct[0]
  });
});

app.listen(PORT, () => {
  console.log(`Products API Server is running on http://localhost:${PORT}`);
});
