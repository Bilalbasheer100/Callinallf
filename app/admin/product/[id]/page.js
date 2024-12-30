'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const { data } = await axios.get(`/api/products?id=${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product details:', error);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <button
        className="mb-6 bg-gray-800 text-white px-4 py-2 rounded-md shadow hover:bg-gray-900"
        onClick={() => router.push('/admin/products')}
      >
        ← Back to Products
      </button>

      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="w-full md:w-1/2">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-md shadow-md"
              />
            ) : (
              <div className="w-full h-96 flex justify-center items-center bg-gray-200 rounded-md">
                <p className="text-gray-500">No Image Available</p>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2 flex flex-col justify-between">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-gray-700 text-lg mb-6">{product.description}</p>
            <div className="space-y-4">
              <p className="text-lg">
                <span className="font-medium text-gray-800">Price:</span>{' '}
                <span className="text-green-600 font-semibold">${product.price}</span>
              </p>
              <p className="text-lg">
                <span className="font-medium text-gray-800">Category:</span>{' '}
                <span className="text-gray-600">{product.category}</span>
              </p>
              <p className="text-sm text-gray-500">
                Added on {new Date(product.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
