'use client';

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Checkout({ cartItems }) {
  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const res = await fetch('/api/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems }),
    });

    const { id } = await res.json();
    stripe.redirectToCheckout({ sessionId: id });
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <button onClick={handleCheckout} className="mt-5 p-3 bg-green-500 text-white rounded">
        Proceed to Payment
      </button>
    </div>
  );
}
