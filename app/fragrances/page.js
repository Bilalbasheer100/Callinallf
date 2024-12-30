'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function FragrancesSection() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products?category=Fragrances');
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = () => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1]
    );
    setFilteredProducts(filtered);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 1000]);
    setFilteredProducts(products);
  };

  return (
    <div className="min-h-screen bg-[#EEECED] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Fragrances Section
        </h1>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 md:gap-6 items-center">
          <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
            Category: Fragrances
          </div>
          <div className="flex-1 w-full md:w-auto">
            <input
              className="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
              type="text"
              placeholder="Search fragrances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <label className="text-gray-600">Price:</label>
            <div className="flex items-center gap-2">
              <input
                className="w-20 border rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
              />
              <span>-</span>
              <input
                className="w-20 border rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
              />
            </div>
          </div>
          <div className="flex space-x-4 w-full md:w-auto">
            <button
              className="bg-[#949391] text-white rounded-lg px-4 py-2 w-full md:w-auto hover:bg-gray-700 transition duration-200"
              onClick={handleSearch}
            >
              Apply Filters
            </button>
            <button
              className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 w-full md:w-auto hover:bg-gray-400 transition duration-200"
              onClick={handleResetFilters}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center text-center transition transform hover:-translate-y-2"
            >
              <div className="w-40 h-40 sm:w-48 sm:h-48 mb-4 overflow-hidden rounded-lg border border-gray-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                {product.name}
              </h2>
              <div className="flex justify-between items-center w-full px-4 mb-4">
                <p className="text-lg font-bold text-green-600">${product.price}</p>
                <p className="text-sm text-gray-500">Fragrances</p>
              </div>
              <div className="flex w-full space-x-2">
                <button
                  className="bg-[#949391] text-white rounded-lg px-4 py-2 flex-1 hover:bg-gray-700 transition duration-200"
                  onClick={() => router.push(`/product/${product._id}`)}
                >
                  View Details
                </button>
                <button
                  className="bg-[#2D332F] text-white rounded-lg px-4 py-2 flex-1 hover:bg-gray-800 transition duration-200"
                  onClick={() => alert('Added to Cart!')}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-600 mt-8">
            No fragrances match your search criteria.
          </p>
        )}
      </div>
    </div>
  );
}
