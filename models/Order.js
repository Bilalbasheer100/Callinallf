// import mongoose from 'mongoose';

// const OrderSchema = new mongoose.Schema(
//   {
//     userId: { type: String, required: true },
//     products: [
//       {
//         productId: String,
//         quantity: Number,
//       },
//     ],
//     totalAmount: { type: Number, required: true },
//     paymentStatus: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Order || mongoose.model('Order', OrderSchema);






import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, required: true },
    paymentMethod: { type: String, required: true }, // Store payment method (e.g., "card")
    transactionId: { type: String, required: true }, // Store Stripe transaction ID
    customerEmail: { type: String, required: true }, // Store customer email
    billingAddress: { 
      type: Object, 
      required: true,
      default: {},
    }, // Store billing address
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
