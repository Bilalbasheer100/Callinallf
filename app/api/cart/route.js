import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/utils/mongoose';
import Cart from '@/models/Cart';

// GET Cart Items
export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const cartItems = await Cart.find({ userId }); // Fetch cart items specific to the user
    return NextResponse.json(cartItems, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch cart items:', error);
    return NextResponse.json({ error: 'Failed to fetch cart items' }, { status: 500 });
  }
}

// Handle POST request for adding items to the cart
export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const { name, price, quantity, category, image } = body;

    // Validate required fields
    if (!name || !price || !quantity || !category || !image) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Check if the product already exists in the cart
    const existingCartItem = await Cart.findOne({ name, userId });

    if (existingCartItem) {
      // Update quantity if item exists
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      return NextResponse.json(existingCartItem, { status: 200 });
    }

    // Create a new cart item if it doesn't exist
    const newCartItem = new Cart({
      userId,
      name,
      price,
      quantity,
      category,
      image,
    });

    const savedCartItem = await newCartItem.save();

    return NextResponse.json(savedCartItem, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Failed to add product to cart.' }, { status: 500 });
  }
}

// Handle PUT request to update item quantity
export async function PUT(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const { id, quantity } = body;

    // Validate required fields
    if (!id || quantity === undefined || quantity < 1) {
      return NextResponse.json({ error: 'Invalid item ID or quantity.' }, { status: 400 });
    }

    // Update the cart item
    const updatedCartItem = await Cart.findOneAndUpdate(
      { _id: id, userId },
      { quantity },
      { new: true } // Return the updated document
    );

    if (!updatedCartItem) {
      return NextResponse.json({ error: 'Cart item not found.' }, { status: 404 });
    }

    return NextResponse.json(updatedCartItem, { status: 200 });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Failed to update cart item.' }, { status: 500 });
  }
}

// Handle DELETE request to remove item from the cart
export async function DELETE(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const { id } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json({ error: 'Item ID is required.' }, { status: 400 });
    }

    // Remove the cart item
    const deletedCartItem = await Cart.findOneAndDelete({ _id: id, userId });

    if (!deletedCartItem) {
      return NextResponse.json({ error: 'Cart item not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Item removed successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json({ error: 'Failed to remove cart item.' }, { status: 500 });
  }
}
