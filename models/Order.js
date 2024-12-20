import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  user: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
