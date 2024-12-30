'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
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
      (categoryFilter ? product.category === categoryFilter : true) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1]
    );
    setFilteredProducts(filtered);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setPriceRange([0, 1000]);
    setFilteredProducts(products);
  };

  const handleAddToCart = async (product) => {
    if (!isLoaded) {
      alert('Loading authentication status...');
      return;
    }

    if (!isSignedIn) {
      alert('Please sign in to add items to your cart.');
      router.push('/sign-in'); // Redirect to sign-in page
      return;
    }

    try {
      const response = await axios.post('/api/cart', {
        name: product.name,
        price: product.price,
        quantity: 1,
        category: product.category,
        image: product.image,
      });

      if (response.status === 201 || response.status === 200) {
        alert(`${product.name} added to cart!`);
      } else {
        alert('Failed to add product to cart.');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('An error occurred while adding the product to the cart.');
    }
  };

  return (
    <div className="min-h-screen bg-[#EEECED] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          All Products
        </h1>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              className="border rounded-lg h-12 p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-300"
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <div className="border rounded-lg h-12 p-3 w-full focus-within:ring-2 focus-within:ring-blue-400 flex items-center">
              <select
                className="appearance-none w-full h-full bg-transparent outline-none text-gray-800"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="Clothes">Clothes</option>
                <option value="Skin Care">Skin Care</option>
                <option value="Fragrances">Fragrances</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Price Range */}
          <div className="relative flex items-center space-x-2">
            <input
              className="border rounded-lg h-12 p-3 w-1/2 focus:outline-none focus:ring-2 focus:ring-gray-300"
              type="number"
              placeholder="Min Price"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([Number(e.target.value), priceRange[1]])
              }
            />
            <input
              className="border rounded-lg h-12 p-3 w-1/2 focus:outline-none focus:ring-2 focus:ring-gray-300"
              type="number"
              placeholder="Max Price"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              className="bg-[#949391] text-white rounded-lg px-4 py-2 h-12 w-full hover:bg-gray-700 transition duration-200"
              onClick={handleSearch}
            >
              Apply Filters
            </button>
            <button
              className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 h-12 w-full hover:bg-gray-400 transition duration-200"
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
              {/* Image */}
              <div className="w-40 h-40 sm:w-48 sm:h-48 mb-4 overflow-hidden rounded-lg border border-gray-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              {/* Details */}
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                {product.name}
              </h2>
              <div className="flex justify-between items-center w-full px-4 mb-4">
                <p className="text-lg font-bold text-green-600">${product.price}</p>
                <p className="text-sm text-gray-500">{product.category}</p>
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
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-600 mt-8">
            No products match your search criteria.
          </p>
        )}
      </div>
    </div>
  );
}
