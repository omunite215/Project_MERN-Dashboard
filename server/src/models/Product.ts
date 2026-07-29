import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Product {
  @prop() public name?: string;
  @prop() public price?: number;
  @prop() public description?: string;
  @prop() public category?: string;
  @prop() public rating?: number;
  @prop() public supply?: number;
}

export default getModelForClass(Product);
