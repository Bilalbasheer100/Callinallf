'use client';

import { useEffect, useState } from 'react';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setCartItems(data);
    };
    fetchCart();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Your Cart</h1>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>{item.name}</span>
            <span>${item.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
