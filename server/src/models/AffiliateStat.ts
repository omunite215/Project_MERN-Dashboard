import { prop, getModelForClass, modelOptions, type Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "./User.js";

@modelOptions({ schemaOptions: { timestamps: true } })
export class AffiliateStat {
  @prop({ ref: () => User }) public userId?: Ref<User>;
  @prop({ type: () => [Types.ObjectId], default: [] }) public affiliateSales?: Types.ObjectId[];
}

export default getModelForClass(AffiliateStat);
