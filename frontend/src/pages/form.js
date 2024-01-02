// ProductForm.js
import React, { useState, useRef } from 'react';
import axios from 'axios';
import JsBarcode from 'jsbarcode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ProductForm = () => {
  const [product, setProduct] = useState({
    image: null,
    productId: '',
    name: '',
    manufacturer: '',
    description: '',
    quantity: 0,
  });

  const barcodeRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const fileValue = type === 'file' ? e.target.files[0] : value;

    setProduct({
      ...product,
      [name]: fileValue,
    });
  };

  const uploadToCloudinary = async () => {
    const formData = new FormData();
    formData.append('file', product.image);
    formData.append('upload_preset', 'e-commerce'); // Replace with your Cloudinary upload preset

    const response = await axios.post('https://api.cloudinary.com/v1_1/centoscloud/image/upload', formData);

    return response.data;
  };

  const generateBarcode = () => {
    const { productId, name, } = product;
    return `${productId}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload image to Cloudinary
      const cloudinaryData = await uploadToCloudinary();

      // Save product details to MongoDB
      const response = await axios.post('http://localhost:4000/api/products', {
        productId: product.productId,
        name: product.name,
        manufacturer: product.manufacturer,
        description: product.description,
        quantity: product.quantity,
        image: cloudinaryData.secure_url, // Use the secure_url from Cloudinary response
        // Add other fields as needed
      });

      const barcodeData = generateBarcode();
      JsBarcode(barcodeRef.current, barcodeData);
      console.log('Barcode generated for product:', barcodeData);

      // You can add additional logic here, such as clearing the form fields
      setProduct({
        image: null,
        productId: '',
        name: '',
        manufacturer: '',
        description: '',
        quantity: 0,
      });

      console.log('Product added to MongoDB:', response.data);
      toast.success("Product Added Successfully")
    } catch (error) {
      console.error('Error handling form submission:', error);
    }
  };

  const handlePrintBarcode = () => {
    // You can customize this print logic based on your requirements
      const printWindow = window.open('', '_blank');
  
  // Copy the barcode content to the new window or iframe
  printWindow.document.write('<html><head><title>Print Barcode</title></head><body>');
  printWindow.document.write('<div style="text-align:center;">');
  printWindow.document.write(barcodeRef.current.outerHTML);
  printWindow.document.write('</div></body></html>');
  
  // Initiate the print process
  printWindow.document.close();
  printWindow.print();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-8 bg-white rounded shadow-md">
      <label className="block mb-2 text-gray-800" htmlFor="image">
        Upload Image:
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleChange}
          className="w-full px-4 py-2 mt-2 border rounded focus:outline-none focus:border-blue-500"
        />
      </label>

      <label className="block mb-2 text-gray-800" htmlFor="productId">
        Product ID:
        <input
          type="text"
          id="productId"
          name="productId"
          value={product.productId}
          onChange={handleChange}
          className="w-full px-4 py-2 mt-2 border rounded focus:outline-none focus:border-blue-500"
        />
      </label>

      <label className="block mb-2 text-gray-800" htmlFor="name">
        Name:
        <input
          type="text"
          id="name"
          name="name"
          value={product.name}
          onChange={handleChange}
          className="w-full px-4 py-2 mt-2 border rounded focus:outline-none focus:border-blue-500"
        />
      </label>

      <label className="block mb-2 text-gray-800" htmlFor="manufacturer">
        Manufacturer:
        <input
          type="text"
          id="manufacturer"
          name="manufacturer"
          value={product.manufacturer}
          onChange={handleChange}
          className="w-full px-4 py-2 mt-2 border rounded focus:outline-none focus:border-blue-500"
        />
      </label>

      <label className="block mb-2 text-gray-800" htmlFor="description">
        Description:
        <textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleChange}
          className="w-full px-4 py-2 mt-2 border rounded focus:outline-none focus:border-blue-500"
        />
      </label>

      <label className="block mb-2 text-gray-800" htmlFor="quantity">
        Quantity:
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={product.quantity}
          onChange={handleChange}
          className="w-full px-4 py-2 mt-2 border rounded focus:outline-none focus:border-blue-500"
        />
      </label>

      {/* Display barcode here after form submission */}
      <div className="flex justify-center items-center mt-4">
        <svg ref={barcodeRef}></svg>

        {/* Print button */}
        <button
          type="button"
          onClick={handlePrintBarcode}
          className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Print Barcode
        </button>
      </div>

      <button type="submit" className="w-full px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-700">
        Add Product
      </button>
      <ToastContainer />
    </form>
  );
};

export default ProductForm;
