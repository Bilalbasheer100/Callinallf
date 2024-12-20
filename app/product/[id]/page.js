import dbConnect from '../../../utils/mongoose';
import Product from '../../../models/Product';

export default async function ProductDetails({ params }) {
  await dbConnect();
  const product = await Product.findById(params.id).lean();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="mt-2">${product.price}</p>
    </div>
  );
}
