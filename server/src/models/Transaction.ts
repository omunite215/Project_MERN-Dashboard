import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { Types } from "mongoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Transaction {
  @prop() public userId?: string;
  @prop() public cost?: string;
  @prop({ type: () => [Types.ObjectId], default: [] }) public products?: Types.ObjectId[];
}

export default getModelForClass(Transaction);
