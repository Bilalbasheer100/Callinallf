'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Products List</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 mb-4"
        onClick={() => router.push('/admin/add-form')}
      >
        + Add Product
      </button>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Image</th>
            <th className="border p-2">Product Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50">
              <td className="border p-2">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  'No Image'
                )}
              </td>
              <td className="border p-2">{product.name}</td>
              <td className="border p-2">{product.category}</td>
              <td className="border p-2">${product.price}</td>
              <td className="border p-2 flex space-x-4">
                <button
                  className="text-blue-500 underline"
                  onClick={() => router.push(`/admin/product-details/${product._id}`)}
                >
                  More Details
                </button>
                <button
                  className="text-yellow-500 underline"
                  onClick={() => router.push(`/admin/edit-form/${product._id}`)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 underline"
                  onClick={async () => {
                    try {
                      await axios.delete(`/api/products?id=${product._id}`);
                      setProducts(products.filter((p) => p._id !== product._id));
                    } catch (error) {
                      console.error('Failed to delete product:', error);
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
