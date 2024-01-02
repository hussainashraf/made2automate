import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { productId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/productsinfo');
        setProducts(response.data);

        if (productId) {
          const selectedProduct = response.data.find((product) => product._id === productId);

          if (selectedProduct) {
            setSelectedProduct(selectedProduct);
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, [productId]);

  // Display details for the selected product if productId is present
  if (selectedProduct) {
    return (
      <div className="container mx-auto mt-8">
        {/* Display details for the selected product */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Rest of your details display logic */}
          <h2>{selectedProduct.name}</h2>
          <img
          src={selectedProduct.image}
          alt={`na`}
          />
          <h2>{selectedProduct.description}</h2>
          <h2>{selectedProduct.quantity}</h2>
          {/* Display other details as needed */}
        </div>
      </div>
    );
  }

  // Display the list of products if no productId is present
  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-8">Product List</h2>

      {products.length === 0 ? (
        <p className="text-gray-600">No products available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white p-6 rounded-lg shadow-md">
              {/* Display Cloudinary image if available */}
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
              )}
              <div className="h-32 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">Product ID: {product.productId}</p>
                <p className="text-gray-600 mb-2">Manufacturer: {product.manufacturer}</p>
                <p className="text-gray-600 mb-2">Description: {product.description}</p>
                <p className="text-gray-600 mb-2">Quantity: {product.quantity}</p>
              </div>
              <Link to={`/product/${product._id}`}>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                >
                  View Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
