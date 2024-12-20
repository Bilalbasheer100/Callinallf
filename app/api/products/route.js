import { NextResponse } from 'next/server'; // Use NextResponse
import dbConnect from '@/utils/mongoose';
import Product from '@/models/Product';

// GET Products or a Single Product
export async function GET(req) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (id) {
      const product = await Product.findById(id);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(product, { status: 200 });
    }

    const products = await Product.find();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST a New Product
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, price, category, image } = body;

    if (!name || !price || !category || !image) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const newProduct = new Product({ name, price, category, image });
    const savedProduct = await newProduct.save();

    return NextResponse.json(savedProduct, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// PUT (Update) a Product
export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, name, price, category, image } = body;

    if (!id || !name || !price || !category || !image) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, category, image },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE a Product
export async function DELETE(req) {
  try {
    await dbConnect();
    const id = new URL(req.url).searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
