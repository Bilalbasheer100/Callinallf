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



import { buffer } from 'micro';
import Stripe from 'stripe';
import dbConnect from '@/utils/mongoose';
import Order from '@/models/Order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // Stripe requires raw body
  },
};

export async function POST(req) {
  let event;

  try {
    // Parse the raw body
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']; // Access header correctly
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    console.log('Webhook verified successfully:', event.type);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle Stripe webhook events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;

      console.log('Checkout Session Completed Event:', session);

      try {
        // Connect to the database
        await dbConnect();

        // Store the order in the database
        const order = new Order({
          userId: session.metadata.userId,
          products: JSON.parse(session.metadata.cartItems),
          totalAmount: session.amount_total / 100, // Convert cents to dollars
          paymentStatus: session.payment_status,
        });

        await order.save();
        console.log('Order saved successfully:', order);
      } catch (err) {
        console.error('Error saving order to database:', err);
        return new Response('Error saving order', { status: 500 });
      }
      break;
    }

    // Handle other event types
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return success response to Stripe
  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
