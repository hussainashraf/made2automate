const express = require('express')
const app = express()
const port = 4000
const bodyParser = require('body-parser');
const cors = require('cors'); 
const mongoose = require('./db');
const Product = require('./schema/Product')
const multer = require('multer');
app.use(multer().single('image'));
app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// server.js
// Modify the response to include the entire product object
app.post('/api/products', async (req, res) => {
    try {
      // The image file is available as req.file
      const { image, productId, name, manufacturer, description, quantity } = req.body;
  
      const newProduct = new Product({
        image, // Assuming image is a URL or a file path
        productId,
        name,
        manufacturer,
        description,
        quantity,
      });
  
      const savedProduct = await newProduct.save();
      console.log('Product saved:', savedProduct);
  
      res.status(201).send(savedProduct);
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).send(error.message);
    }
  });
  
app.get('/api/productsinfo', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
    }
}); 
  
app.get('/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;

    // Ensure the productId is a valid ObjectId before querying the database
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})