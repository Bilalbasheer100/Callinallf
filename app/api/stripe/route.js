import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { cartItems } = await req.json();

  const lineItems = cartItems.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: { name: item.name, images: [item.image] },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${req.headers.origin}/checkout/success`,
    cancel_url: `${req.headers.origin}/checkout`,
  });

  return new Response(JSON.stringify({ id: session.id }), { status: 200 });
}
