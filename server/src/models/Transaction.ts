import mongoose, { type InferSchemaType } from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: String,
    cost: String,
    products: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  },
  { timestamps: true }
);

export type ITransaction = InferSchemaType<typeof TransactionSchema>;
export default mongoose.model("Transaction", TransactionSchema);
