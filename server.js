// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const auth = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");
const jwt = require("jsonwebtoken");

//dotenv for environment variables
require("dotenv").config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(logger);
app.use(errorHandler);

connectDB();

//product routes
app.use("/products", auth, require("./routes/productRoutes"));

// Root route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// GET /products - Get all products with filtering and pagination
app.get("/products", (req, res) => {
  const { category, page = 1, limit = 10, search } = req.query;

  let filteredProducts = products;

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === category
    );
  }

  // Search by name
  if (search) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  res.json({
    page: parseInt(page),
    limit: parseInt(limit),
    total: filteredProducts.length,
    products: paginatedProducts,
  });
});

// GET /products/stats - Get product statistics by category
app.get("/products/stats", (req, res) => {
  const stats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  res.json(stats);
});

// Route to generate a test JWT token
app.get("/generate-test-token", (req, res) => {
  const payload = {
    user: {
      id: "123",
      name: "Test User",
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET);
  res.json({ token });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
