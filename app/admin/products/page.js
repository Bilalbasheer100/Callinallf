'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useUser, RedirectToSignIn } from '@clerk/nextjs';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    // Fetch all products
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);

        // Pre-select featured products
        const initialFeatured = data
          .filter((product) => product.featured)
          .map((product) => product._id);
        setFeatured(initialFeatured);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products. Please try again.');
      }
    };

    if (isSignedIn) fetchProducts();
  }, [isSignedIn]);

  // Redirect to sign-in if not authenticated
  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <RedirectToSignIn />;

  const handleFeatureToggle = (productId) => {
    setError('');
    setFeatured((prevFeatured) => {
      if (prevFeatured.includes(productId)) {
        return prevFeatured.filter((id) => id !== productId);
      }
  
      if (prevFeatured.length < 4) {
        return [...prevFeatured, productId];
      }
  
      setError('You can only select up to 4 featured items.');
      return prevFeatured;
    });
  };
  

  const handleSaveFeatured = async () => {
    if (featured.length !== 4) {
      setError('You must select exactly 4 featured items.');
      return;
    }
  
    try {
      // Prepare the updated products with their new `featured` status
      const updatedProducts = products.map((product) => ({
        id: product._id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        image: product.image,
        featured: featured.includes(product._id), // Set featured status based on state
      }));
  
      // Send a single PUT request to update all products
      const response = await axios.put('/api/products', updatedProducts);
  
      if (response.status === 200) {
        alert('Featured items saved successfully!');
      }
    } catch (err) {
      console.error('Error saving featured items:', err);
      setError('Failed to save featured items. Please try again.');
    }
  };
  
  

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`/api/products?id=${productId}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again.');
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products List</h1>
        <div className="flex gap-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md shadow"
            onClick={handleSaveFeatured}
          >
            Save Featured Items
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md shadow"
            onClick={() => router.push('/admin/add-form')}
          >
            + Add Product
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full text-left text-sm text-gray-700 bg-white border border-gray-200">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-4 py-3 border">Image</th>
              <th className="px-4 py-3 border">Product Name</th>
              <th className="px-4 py-3 border">Category</th>
              <th className="px-4 py-3 border">Price</th>
              <th className="px-4 py-3 border">Featured</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 border">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md shadow-md"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>
                <td className="px-4 py-3 border text-gray-800 font-medium">{product.name}</td>
                <td className="px-4 py-3 border text-gray-600">{product.category}</td>
                <td className="px-4 py-3 border text-gray-600">${product.price}</td>
                <td className="px-4 py-3 border text-center">
                  <input
                    type="checkbox"
                    checked={featured.includes(product._id)}
                    onChange={() => handleFeatureToggle(product._id)}
                    className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-400 border-gray-300 rounded"
                  />
                </td>
                <td className="px-4 py-3 border flex flex-col md:flex-row gap-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded shadow"
                    onClick={() => router.push(`/admin/product/${product._id}`)}
                  >
                    Details
                  </button>
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-medium px-4 py-2 rounded shadow"
                    onClick={() => router.push(`/admin/edit-form/${product._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded shadow"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


