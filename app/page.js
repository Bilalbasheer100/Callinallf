'use client';

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    gsap.from('.hero-text', { opacity: 0, y: 50, duration: 1 });
    gsap.from('.collection-item', { opacity: 0, y: 20, stagger: 0.2, delay: 0.5 });
  }, []);

  return (
    <main className="font-sans bg-[#EEECED]">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 border-b bg-[#2D332F] sm:px-20">
        <h1 className="text-xl text-gray-200 font-bold font-serif sm:text-2xl italic">Callin' All F</h1>

        {/* Hamburger Menu Toggle */}
        <button
          className="sm:hidden text-2xl text-gray-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? '✖' : '☰'}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex space-x-6 text-gray-300">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Products</a>
          <button className="">🛒 Cart</button>
          <button className="">📄 Orders</button>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white border-b px-6 py-4">
          <nav className="flex flex-col space-y-4">
            <a href="#" className="hover:underline">Home</a>
            <a href="#" className="hover:underline">Catalog</a>
            <a href="#" className="hover:underline">Contact</a>
            <button className="flex items-center space-x-2">
              <span>🛒</span>
              <span>Cart</span>
            </button>
            <button className="flex items-center space-x-2">
              <span>👤</span>
              <span>Orders</span>
            </button>
          </nav>
        </div>
      )}

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
            <a href="#" className="block h-full">
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
            <a href="#" className="block h-full">
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
          <a href="#" className="block h-full">
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
          <div className='sm:col-span-1'>
          {/* Clothes */}
          <div className="collection-item bg-white rounded-lg shadow-md overflow-hidden h-[40rem] mb-4 ">
            <a href="#" className="block h-full">
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
          
          {/* Skin Care */}
          <div className="collection-item bg-white rounded-lg shadow-md overflow-hidden h-[40rem] sm:col-span-1">
            <a href="#" className="block h-full">
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
          {/* Fragrances */}
          <div className="collection-item bg-white rounded-lg shadow-md overflow-hidden h-[81rem] sm:col-span-2">
            <a href="#" className="block h-full">
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
        <h2 className="text-2xl font-bold mb-4 text-gray-800 sm:text-3xl">Featured Collection</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="featured-product bg-white border rounded-lg shadow p-4">
              <div className="bg-gray-200 h-24 sm:h-40 w-full"></div>
              <h3 className="mt-2 text-base font-bold sm:text-lg">Example product title</h3>
              <p className="mt-1 text-sm text-gray-500">Dhs. 19.99 AED</p>
            </div>
          ))}
        </div>
      </section>

      {/* Subscribe Section */}
      <footer className="bg-[#2D332F] text-white mt-12 py-8 px-6 text-center sm:px-16">
        <h3 className="text-lg font-bold sm:text-xl">Subscribe to our emails</h3>
        <p className="mt-2 text-xs sm:text-sm">
          Subscribe to our mailing list for insider news, product launches, and more.
        </p>
        <div className="mt-4 flex  sm:flex-row justify-center">
          <input
            type="email"
            placeholder="Email"
            className="p-2  rounded-l-md rounded-t-none border border-gray-300 focus:outline-none"
          />
          <button className="bg-[#949391] text-white px-4 py-2 rounded-r-md rounded-b-none">
            →
          </button>
        </div>
      </footer>
    </main>
  );
}
