// import { NextResponse } from 'next/server';
// import Stripe from 'stripe';
// import dbConnect from '@/utils/mongoose';
// import Product from '@/models/Product';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const { cartItems, userId } = await req.json();

//     // Validate request data
//     if (!cartItems || cartItems.length === 0) {
//       return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
//     }

//     if (!userId) {
//       return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
//     }

//     // Fetch and validate products from the database
//     const lineItems = await Promise.all(
//       cartItems.map(async (item) => {
//         const product = await Product.findById(item.productId);
//         if (!product) {
//           throw new Error(`Product with ID ${item.productId} not found`);
//         }
//         if (item.quantity <= 0) {
//           throw new Error(`Invalid quantity for product ID ${item.productId}`);
//         }

//         return {
//           price_data: {
//             currency: 'usd',
//             product_data: {
//               name: product.name,
//               description: product.description,
//               images: product.image ? [product.image] : [], // Ensure image is optional
//             },
//             unit_amount: Math.round(product.price * 100), // Stripe expects price in cents
//           },
//           quantity: item.quantity,
//         };
//       })
//     );

//     // Create Stripe checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: lineItems,
//       mode: 'payment',
//       success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
//       metadata: {
//         userId, // Pass userId as metadata
//         cartItems: JSON.stringify(cartItems), // Pass cart items as JSON string
//       },
//     });

//     return NextResponse.json({ url: session.url });
//   } catch (error) {
//     console.error('Stripe Checkout Error:', error.message);

//     // Return detailed error response
//     return NextResponse.json(
//       { error: `Failed to create Stripe checkout session: ${error.message}` },
//       { status: 500 }
//     );
//   }
// }





// import { NextResponse } from 'next/server';
// import Stripe from 'stripe';
// import dbConnect from '@/utils/mongoose';
// import Product from '@/models/Product';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const { cartItems, userId, customerEmail, billingAddress } = await req.json();

//     if (!cartItems || cartItems.length === 0) {
//       return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
//     }

//     if (!userId || !customerEmail || !billingAddress) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     const lineItems = await Promise.all(
//       cartItems.map(async (item) => {
//         const product = await Product.findById(item.productId);
//         if (!product) {
//           throw new Error(`Product with ID ${item.productId} not found`);
//         }
//         if (item.quantity <= 0) {
//           throw new Error(`Invalid quantity for product ID ${item.productId}`);
//         }

//         return {
//           price_data: {
//             currency: 'usd',
//             product_data: {
//               name: product.name,
//               description: product.description,
//               images: product.image ? [product.image] : [],
//             },
//             unit_amount: Math.round(product.price * 100),
//           },
//           quantity: item.quantity,
//         };
//       })
//     );

//     // Create Stripe checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       customer_email: customerEmail,
//       line_items: lineItems,
//       mode: 'payment',
//       success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
//       metadata: {
//         userId,
//         cartItems: JSON.stringify(cartItems),
//         customerEmail,
//         billingAddress: JSON.stringify(billingAddress), // Store billing details securely
//       },
//     });

//     return NextResponse.json({ url: session.url });
//   } catch (error) {
//     console.error('Stripe Checkout Error:', error.message);
//     return NextResponse.json(
//       { error: `Failed to create Stripe checkout session: ${error.message}` },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/utils/mongoose';
import Product from '@/models/Product';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export async function POST(req) {
  try {
    await dbConnect();
    
    const { cartItems, userId } = await req.json(); // Removed customerEmail and billingAddress

    console.log("Received checkout request:", { userId, cartItems });

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const lineItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
        if (item.quantity <= 0) {
          throw new Error(`Invalid quantity for product ID ${item.productId}`);
        }

        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
              images: product.image ? [product.image] : [],
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: item.quantity,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      // Configure Stripe to collect the billing address.
      billing_address_collection: 'required',
      // Optionally, if you want to prefill the email (if you have it), you can include it.
      // If you leave this out, Stripe will prompt the customer for an email.
      // customer_email: customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: {
        userId,
        cartItems: JSON.stringify(cartItems),
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
