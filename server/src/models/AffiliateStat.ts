import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { Types } from "mongoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class AffiliateStat {
  @prop() public userId?: Types.ObjectId; // TODO(1.3): switch to Ref<User> once User is a Typegoose class
  @prop({ type: () => [Types.ObjectId], default: [] }) public affiliateSales?: Types.ObjectId[];
}

export default getModelForClass(AffiliateStat);
