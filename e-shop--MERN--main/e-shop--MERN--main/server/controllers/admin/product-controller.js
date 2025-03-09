const mysql = require("mysql2");
const { imageUploadUtil } = require("../../helper/cloudinary");
const connection = require('../../database/db');


// Handle image upload
const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
    } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occurred",
    });
  }
};

// Add a new product
const addProduct = async (req, res) => {
  console.log("first")
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      // averageReview,
    } = req.body;

    // Create the products table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        brand VARCHAR(100),
        price DECIMAL(10, 2) NOT NULL,
        salePrice DECIMAL(10, 2),
        totalStock INT NOT NULL,
        averageReview DECIMAL(3, 2) DEFAULT 0.00
        );
    `;

    await connection.promise().query(createTableQuery);

    const [result] = await connection.promise().query(
      `INSERT INTO products (image, title, description, category, brand, price, salePrice, totalStock) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [image, title, description, category, brand, price, salePrice, totalStock]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, ...req.body },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

// Fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const [rows] = await connection.promise().query("SELECT * FROM products");
    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

// Edit a product
const editProduct = async (req, res) => {
  console.log("in edit product api call")
  try {
    const { id } = req.params;
    console.log("id", id)
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    // Use promise wrapper for the SELECT query
    const [rows] = await connection.promise().query("SELECT * FROM products WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Use promise wrapper for the UPDATE query as well
    await connection.promise().query(
      `UPDATE products 
       SET title = ?, description = ?, category = ?, brand = ?, price = ?, salePrice = ?, totalStock = ?
       WHERE id = ?`,
      [
        // image || rows[0].image,
        title || rows[0].title,
        description || rows[0].description,
        category || rows[0].category,
        brand || rows[0].brand,
        price === "" ? 0 : price || rows[0].price,
        salePrice === "" ? 0 : salePrice || rows[0].salePrice,
        totalStock || rows[0].totalStock,
        id,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};


// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await connection.promise().query("DELETE FROM products WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occurred",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};