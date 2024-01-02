const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
   image: String,
   productId: String,
   name: String,
   manufacturer: String,
   description: String,
   quantity: Number,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product