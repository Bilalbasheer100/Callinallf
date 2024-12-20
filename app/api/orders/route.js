import dbConnect from '../../../utils/mongoose';
import Order from '../../../models/Order';

export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const newOrder = await Order.create(data);
  return new Response(JSON.stringify(newOrder), { status: 201 });
}
