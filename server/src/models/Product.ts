import mongoose, { type InferSchemaType } from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
    category: String,
    rating: Number,
    supply: Number,
  },
  { timestamps: true }
);

export type IProduct = InferSchemaType<typeof ProductSchema>;
export default mongoose.model("Product", ProductSchema);
