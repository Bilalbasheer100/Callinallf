import { NextResponse } from 'next/server';
import dbConnect from '@/utils/mongoose';
import Product from '@/models/Product';

// GET Products or a Single Product with Search and Filters
export async function GET(req) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const searchQuery = url.searchParams.get('search');
    const category = url.searchParams.get('category');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const isFeatured = url.searchParams.has('featured') ? url.searchParams.get('featured') === 'true' : null;

    if (id) {
      const product = await Product.findById(id);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(product, { status: 200 });
    }

    let query = {};
    if (searchQuery) query.name = { $regex: searchQuery, $options: 'i' };
    if (category) query.category = category;
    if (isFeatured !== null) query.featured = isFeatured;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query);
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
    const { name, price, category, description, image, featured } = body;

    if (!name || !price || !category || !description || !image) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (featured) {
      const featuredCount = await Product.countDocuments({ featured: true });
      if (featuredCount >= 4) {
        return NextResponse.json(
          { error: 'You can only have 4 featured products' },
          { status: 400 }
        );
      }
    }

    const newProduct = new Product({ name, price, category, description, image, featured });
    const savedProduct = await newProduct.save();

    return NextResponse.json(savedProduct, { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// PUT (Update) a Product
// PUT (Update) a Product
export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, name, price, category, description, image, featured } = body;

    // Validate required fields
    if (!id || !name || !price || !category || !description || !image) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate the featured field logic
    if (featured !== undefined) {
      const currentFeaturedProduct = await Product.findById(id);
      const featuredCount = await Product.countDocuments({ featured: true, _id: { $ne: id } });

      // Check if the current product is already featured
      const isCurrentlyFeatured = currentFeaturedProduct?.featured;

      // Restrict adding a new featured product if the count exceeds 4
      if (featured && !isCurrentlyFeatured && featuredCount >= 4) {
        return NextResponse.json(
          { error: 'You can only have 4 featured products' },
          { status: 400 }
        );
      }
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, category, description, image, featured },
      { new: true }
    );

    // Handle case where product is not found
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
