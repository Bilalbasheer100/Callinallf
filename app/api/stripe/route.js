import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/utils/mongoose';
import Product from '@/models/Product';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    await dbConnect();

    const { cartItems, userId } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is requireds' }, { status: 400 });
    }

    // Fetch products from the database to ensure accurate data
    const lineItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
              images: product.image ? [product.image] : [], // Ensure image is optional
            },
            unit_amount: Math.round(product.price * 100), // Stripe expects price in cents
          },
          quantity: item.quantity,
        };
      })
    );

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: {
        userId, // Pass userId as metadata
        cartItems: JSON.stringify(cartItems), // Pass cart items as JSON string
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error.message);
    return NextResponse.json(
      { error: `Failed to create Stripe checkout session: ${error.message}` },
      { status: 500 }
    );
  }
}
