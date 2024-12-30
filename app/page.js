'use client';

import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data } = await axios.get('/api/products?featured=true');
        if (data.length === 4) {
          setFeaturedProducts(data);
        } else {
          console.error('Featured collection must contain exactly 4 products.');
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      const response = await axios.post('/api/cart', {
        productId: product._id, // Updated to use productId
        quantity: 1,
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

  useGSAP(() => {
    gsap.from('.hero-text', { opacity: 0, y: 50, duration: 1 });
    gsap.from('.collection-item', { opacity: 0, y: 20, stagger: 0.2, delay: 0.5 });
  }, []);

  return (
    <main className="font-sans bg-[#EEECED]">
      {/* Hero Section */}
      <section className="text-center mt-12">
        <h2 className="hero-text text-4xl font-bold italic text-gray-800 font-serif">
          From Iconic Closet to Yours
        </h2>
      </section>

      {/* Collections Section */}
      <section className="mt-12 px-6 sm:px-16">
        {/* Mobile Layout */}
        <div className="grid grid-cols-2 gap-4 mb-4 sm:hidden">
          {/* Clothes */}
          <div className="collection-item bg-white rounded-lg shadow-md overflow-hidden h-[24rem]">
            <a href="/clothes" className="block h-full">
              <img
                src="/clothing.jpg"
                alt="Clothing Collection"
                className="w-full h-[20rem] object-cover"
              />
              <div className="p-4 text-left text-lg font-semibold text-gray-800">
                Clothes →
              </div>
            </a>
          </div>
          {/* Skin Care */}
          <div className="collection-item bg-white rounded-lg shadow-md overflow-hidden h-[24rem]">
            <a href="/skincare" className="block h-full">
              <img
                src="/skincare.jpg"
                alt="Skin Care Collection"
                className="w-full h-[20rem] object-cover"
              />
              <div className="p-4 text-left text-lg font-semibold text-gray-800">
                Skin Care →
              </div>
            </a>
          </div>
        </div>
        <div className="col-span-2 sm:hidden collection-item bg-white rounded-lg shadow-md overflow-hidden h-[50rem]">
          {/* Fragrances */}
          <a href="/fragrances" className="block h-full">
            <img
              src="/fragrances.jpg"
              alt="Fragrances Collection"
              className="w-full h-[46rem] object-cover"
            />
            <div className="p-4 text-left text-lg font-semibold text-gray-800">
              Fragrances →
            </div>
          </a>
        </div>

        {/* Desktop and Tablet Layout */}
        <div className="hidden sm:grid sm:grid-cols-3 sm:gap-6">
          <div className="sm:col-span-1">
            <div className="collection-item bg-white rounded-lg shadow-md overflow-hidden h-[40rem] mb-4">
              <a href="/clothes" className="block h-full">
                <img
                  src="/clothing.jpg"
                  alt="Clothing Collection"
                  className="w-full h-[36rem] object-cover"
                />
                <div className="p-4 text-left text-lg font-semibold text-gray-800">
                  Clothes →
                </div>
              </a>
            </div>
            <div className="collection-item bg-white rounded-lg shadow-md overflow-hidden h-[40rem] sm:col-span-1">
              <a href="/skincare" className="block h-full">
                <img
                  src="/skincare.jpg"
                  alt="Skin Care Collection"
                  className="w-full h-[36rem] object-cover"
                />
                <div className="p-4 text-left text-lg font-semibold text-gray-800">
                  Skin Care →
                </div>
              </a>
            </div>
          </div>
          <div className="collection-item bg-white rounded-lg shadow-md overflow-hidden h-[81rem] sm:col-span-2">
            <a href="/fragrances" className="block h-full">
              <img
                src="/fragrances.jpg"
                alt="Fragrances Collection"
                className="w-full h-[77rem] object-cover"
              />
              <div className="p-4 text-left text-lg font-semibold text-gray-800">
                Fragrances →
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="mt-12 px-6 sm:px-16">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 sm:text-3xl">
          Featured Collection
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.length === 4 ? (
            featuredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center text-center transition transform hover:-translate-y-2 hover:shadow-xl"
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
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <div className="flex w-full space-x-2">
                  <button
                    className="bg-gray-700 text-white rounded-lg px-4 py-2 flex-1 hover:bg-gray-800 transition duration-200"
                    onClick={() => router.push(`/product/${product._id}`)}
                  >
                    View Details
                  </button>
                  <button
                    className="bg-[#2D332F] text-white rounded-lg px-4 py-2 flex-1 hover:bg-[#1c251c] transition duration-200"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 animate-pulse rounded-xl shadow-lg h-72"
                ></div>
              ))
          )}
        </div>
      </section>

      {/* Subscribe Section */}
      <footer className="bg-[#2D332F] text-white mt-12 py-8 px-6 text-center sm:px-16">
        <h3 className="text-lg font-bold sm:text-xl">Subscribe to our emails</h3>
        <p className="mt-2 text-xs sm:text-sm">
          Subscribe to our mailing list for insider news, product launches, and more.
        </p>
        <div className="mt-4 flex sm:flex-row justify-center">
          <input
            type="email"
            placeholder="Email"
            className="p-2 rounded-l-md rounded-t-none border border-gray-300 focus:outline-none"
          />
          <button className="bg-[#949391] text-white px-4 py-2 rounded-r-md rounded-b-none">
            →
          </button>
        </div>
      </footer>
    </main>
  );
}
