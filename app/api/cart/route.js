import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/utils/mongoose';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import User from '@/models/User'; // Import User model for mapping Clerk userId

// GET Cart Items
// GET Cart Items
export async function GET(req) {
    try {
      // Get Clerk Authentication Details
      const { userId: clerkUserId } = getAuth(req);
  
      if (!clerkUserId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      // Connect to the Database
      await dbConnect();
  
      // Find MongoDB user based on Clerk userId
      const user = await User.findOne({ clerkId: clerkUserId });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      // Fetch the Cart
      const cart = await Cart.findOne({ user: user._id }).populate('products.item'); // Populate product details
      if (!cart) {
        return NextResponse.json({ products: [] }, { status: 200 }); // Return empty cart if no cart exists
      }
  
      // Return the Cart
      return NextResponse.json(cart, { status: 200 });
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      return NextResponse.json({ error: 'Failed to fetch cart items' }, { status: 500 });
    }
  }
  

// POST: Add item to cart
export async function POST(req) {
  try {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { productId, quantity } = await req.json();

    if (!productId || !quantity) {
      return NextResponse.json({ error: 'Product ID and quantity are required' }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Find MongoDB user based on Clerk userId
    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let cart = await Cart.findOne({ user: user._id });

    // If no cart exists, create a new one
    if (!cart) {
      cart = new Cart({ user: user._id, products: [] });
    }

    const existingProductIndex = cart.products.findIndex(
      (p) => p.item.toString() === productId
    );

    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += quantity; // Update quantity
    } else {
      cart.products.push({ item: productId, quantity }); // Add new product
    }

    await cart.save();

    const updatedCart = await cart.populate('products.item'); // Populate product details
    return NextResponse.json(updatedCart, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Failed to add product to cart.' }, { status: 500 });
  }
}

// PUT: Update product quantity
export async function PUT(req) {
  try {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { productId, quantity } = await req.json();

    if (!productId || quantity < 1) {
      return NextResponse.json({ error: 'Product ID and valid quantity are required' }, { status: 400 });
    }

    // Find MongoDB user based on Clerk userId
    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.item.toString() === productId
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();

      const updatedCart = await cart.populate('products.item'); // Populate product details
      return NextResponse.json(updatedCart, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Product not found in cart' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Failed to update cart item.' }, { status: 500 });
  }
}

// DELETE: Remove item from cart
export async function DELETE(req) {
  try {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Find MongoDB user based on Clerk userId
    const user = await User.findOne({ clerkId: clerkUserId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    cart.products = cart.products.filter(
      (p) => p.item.toString() !== productId
    );

    await cart.save();

    const updatedCart = await cart.populate('products.item'); // Populate product details
    return NextResponse.json(updatedCart, { message: 'Item removed successfully', status: 200 });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json({ error: 'Failed to remove cart item.' }, { status: 500 });
  }
}
