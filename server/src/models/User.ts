import mongoose, { type InferSchemaType } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, min: 2, max: 100 },
    email: { type: String, required: true, max: 50, unique: true },
    password: { type: String, required: true, min: 5 },
    city: String,
    state: String,
    country: String,
    occupation: String,
    phoneNumber: String,
    transactions: { type: [String], default: [] },
    role: { type: String, enum: ["user", "admin", "superadmin"], default: "admin" },
  },
  { timestamps: true }
);

export type IUser = InferSchemaType<typeof UserSchema>;
export default mongoose.model("User", UserSchema);
