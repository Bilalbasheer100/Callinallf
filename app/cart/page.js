'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser, RedirectToSignIn } from '@clerk/nextjs';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const { isLoaded, isSignedIn } = useUser();

  // Redirect to sign-in if not authenticated
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get('/api/cart', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('clerk.jwt')}`, // Pass JWT for authentication
          },
        });
        setCartItems(data);
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      }
    };

    fetchCart();
  }, []);

  // Calculate total whenever cartItems change
  useEffect(() => {
    const calculateTotal = () => {
      const totalAmount = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotal(totalAmount.toFixed(2));
    };

    calculateTotal();
  }, [cartItems]);

  // Update quantity handler
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.put(
        `/api/cart`,
        { id: itemId, quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('clerk.jwt')}`,
          },
        }
      );
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === itemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error('Failed to update item quantity:', error);
    }
  };

  // Remove item handler
  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`/api/cart`, {
        data: { id: itemId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('clerk.jwt')}`,
        },
      });
      setCartItems((prev) =>
        prev.filter((item) => item._id !== itemId)
      );
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  // Checkout single item handler
  const handleCheckoutItem = async (itemId) => {
    alert(`Checked out item with ID: ${itemId}`);
  };

  // Checkout all items handler
  const handleCheckoutAll = async () => {
    alert('Checked out all items!');
  };

  return (
    <div className="min-h-screen bg-[#EEECED] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty!</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center justify-between bg-gray-100 p-4 rounded-lg shadow"
              >
                {/* Image */}
                <div className="w-24 h-24 overflow-hidden rounded-lg mb-4 sm:mb-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 sm:px-4 text-center sm:text-left">
                  <h2 className="text-lg font-bold text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>

                {/* Quantity and Price */}
                <div className="flex gap-x-3">
                  <div className="flex items-center space-x-4">
                    <p className="text-lg font-bold text-green-600">
                      ${item.price * item.quantity}
                    </p>
                    <div className="flex items-center space-x-2">
                      <button
                        className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                        onClick={() =>
                          handleUpdateQuantity(item._id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-gray-100 rounded-lg">
                        {item.quantity}
                      </span>
                      <button
                        className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                        onClick={() =>
                          handleUpdateQuantity(item._id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row sm:space-x-4 mt-4 sm:mt-0 space-y-2 sm:space-y-0">
                    <button
                      className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition"
                      onClick={() => handleRemoveItem(item._id)}
                    >
                      Remove
                    </button>
                    <button
                      className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition"
                      onClick={() => handleCheckoutItem(item._id)}
                    >
                      Checkout Item
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Total and Checkout All */}
            <div className="flex justify-between items-center border-t pt-4 mt-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Total: <span className="text-green-600">${total}</span>
              </h2>
              <button
                className="bg-[#2D332F] text-white rounded-lg px-6 py-2 hover:bg-gray-800 transition duration-200"
                onClick={handleCheckoutAll}
              >
                Checkout All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
