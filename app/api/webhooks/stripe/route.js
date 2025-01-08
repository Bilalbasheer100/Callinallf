// import { buffer } from 'micro';
// import Stripe from 'stripe';
// import dbConnect from '@/utils/mongoose';
// import Order from '@/models/Order';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const config = {
//   api: {
//     bodyParser: false, // Stripe requires raw body
//   },
// };

// export async function POST(req) {
//   const buf = await buffer(req);
//   const sig = req.headers.get('stripe-signature'); // Adjust for Fetch API headers
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

//   let event;

//   try {
//     // Verify the webhook signature
//     event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
//   } catch (err) {
//     console.error('Webhook signature verification failed:', err.message);
//     return new Response(`Webhook Error: ${err.message}`, { status: 400 });
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'checkout.session.completed': {
//       const session = event.data.object;

//       // Connect to the database
//       await dbConnect();

//       // Store the order in the database
//       const order = new Order({
//         userId: session.metadata.userId,
//         products: JSON.parse(session.metadata.cartItems),
//         totalAmount: session.amount_total / 100, // Stripe amounts are in cents
//         paymentStatus: session.payment_status,
//       });

//       try {
//         await order.save();
//         console.log('Order saved:', order);
//       } catch (err) {
//         console.error('Error saving order:', err);
//       }
//       break;
//     }

//     // Handle other event types if needed
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   return new Response(JSON.stringify({ received: true }), { status: 200 });
// }


// import { buffer } from 'micro';
// import Stripe from 'stripe';
// import dbConnect from '@/utils/mongoose';
// import Order from '@/models/Order';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const config = {
//   api: {
//     bodyParser: false, // Stripe requires raw body
//   },
// };

// export async function POST(req) {
//   const buf = await buffer(req);
//   const sig = req.headers.get('stripe-signature'); // Adjust for Fetch API headers
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

//   let event;

//   try {
//     // Verify the webhook signature
//     event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
//     console.log('Webhook verified successfully:', event.type);
//   } catch (err) {
//     console.error('Webhook signature verification failed:', err.message);
//     return new Response(`Webhook Error: ${err.message}`, { status: 400 });
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'checkout.session.completed': {
//       const session = event.data.object;

//       console.log('Checkout Session Completed Event:', session);

//       try {
//         // Connect to the database
//         await dbConnect();

//         // Store the order in the database
//         const order = new Order({
//           userId: session.metadata.userId,
//           products: JSON.parse(session.metadata.cartItems),
//           totalAmount: session.amount_total / 100, // Stripe amounts are in cents
//           paymentStatus: session.payment_status,
//         });

//         await order.save();
//         console.log('Order saved successfully:', order);
//       } catch (err) {
//         console.error('Error saving order to database:', err);
//         return new Response('Error saving order', { status: 500 });
//       }
//       break;
//     }

//     // Handle other event types if needed
//     default:
//       console.log(`Unhandled event type: ${event.type}`);
//   }

//   return new Response(JSON.stringify({ received: true }), { status: 200 });
// }

// import { buffer } from 'micro';
// import Stripe from 'stripe';
// import dbConnect from '@/utils/mongoose';
// import Order from '@/models/Order';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req) {
//   let event;

//   try {
//     const buf = await buffer(req); // Parse the raw body
//     const sig = req.headers['stripe-signature']; // Get Stripe signature
//     const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

//     console.log('Raw body:', buf.toString()); // Log raw body for debugging
//     console.log('Stripe Signature:', sig);

//     // Verify the webhook signature
//     event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
//     console.log('Webhook verified successfully:', event.type);
//   } catch (err) {
//     console.error('Webhook signature verification failed:', err.message);
//     return new Response(`Webhook Error: ${err.message}`, { status: 400 });
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'checkout.session.completed': {
//       const session = event.data.object;

//       try {
//         await dbConnect();
//         const order = new Order({
//           userId: session.metadata.userId,
//           products: JSON.parse(session.metadata.cartItems),
//           totalAmount: session.amount_total / 100, // Stripe uses cents
//           paymentStatus: session.payment_status,
//         });

//         await order.save();
//         console.log('Order saved successfully:', order);
//       } catch (err) {
//         console.error('Error saving order to database:', err.message);
//         return new Response('Error saving order', { status: 500 });
//       }
//       break;
//     }
//     default:
//       console.log(`Unhandled event type: ${event.type}`);
//   }

//   return new Response(JSON.stringify({ received: true }), { status: 200 });
// }


import stripe from 'stripe'
import { NextResponse } from 'next/server'
import dbConnect from '@/utils/mongoose';
import Order from '@/models/Order';

export async function POST(request) {
  const body = await request.text()

  const sig = request.headers.get('stripe-signature')
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    return NextResponse.json({ message: 'Webhook error', error: err })
  }

  // Get the ID and type
  const eventType = event.type

  // CREATE
  if (eventType === 'checkout.session.completed') {
    const session = event.data.object;

      try {
        await dbConnect();
        const order = new Order({
          userId: session.metadata.userId,
          products: JSON.parse(session.metadata.cartItems),
          totalAmount: session.amount_total / 100, // Stripe uses cents
          paymentStatus: session.payment_status,
        });

        await order.save();
        console.log('Order saved successfully:', order);
      } catch (err) {
        console.error('Error saving order to database:', err.message);
        return new Response('Error saving order', { status: 500 });
      }
    }
  return new Response('', { status: 200 })                              
}
