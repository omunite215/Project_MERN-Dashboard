import mongoose, { type InferSchemaType } from "mongoose";

const AffiliateStatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    affiliateSales: { type: [mongoose.Schema.Types.ObjectId], ref: "Transaction", default: [] },
  },
  { timestamps: true }
);

export type IAffiliateStat = InferSchemaType<typeof AffiliateStatSchema>;
export default mongoose.model("AffiliateStat", AffiliateStatSchema);
