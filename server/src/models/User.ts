import { prop, getModelForClass, modelOptions, pre, type DocumentType, Severity } from "@typegoose/typegoose";

export const ROLES = ["user", "admin", "superadmin"] as const;
export type Role = (typeof ROLES)[number];

@pre<User>("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await Bun.password.hash(this.password); // argon2id (Bun default)
})
@modelOptions({ schemaOptions: { timestamps: true }, options: { allowMixed: Severity.ALLOW } })
export class User {
  @prop({ required: true }) public name!: string;
  @prop({ required: true, unique: true }) public email!: string;
  @prop({ required: true, select: false }) public password?: string;
  @prop() public city?: string;
  @prop() public state?: string;
  @prop() public country?: string;
  @prop() public occupation?: string;
  @prop() public phoneNumber?: string;
  @prop({ type: () => [String], default: [] }) public transactions?: string[];
  @prop({ enum: ROLES, default: "user" }) public role!: Role;
  @prop({ default: 0 }) public tokenVersion!: number;

  public async comparePassword(this: DocumentType<User>, candidate: string): Promise<boolean> {
    if (!this.password) return false;
    return Bun.password.verify(candidate, this.password);
  }
}

export default getModelForClass(User);
