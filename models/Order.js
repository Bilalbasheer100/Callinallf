import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: String,
        quantity: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
