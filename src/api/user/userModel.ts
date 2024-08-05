import mongoose, { Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaginateModel } from "../common/paginate";

export interface ShippingAddress {
  city: string;
  country: string;
  line1: string;
  line2?: string;
  postal_code: string;
  state: string;
  default: boolean;
}

// Define the IUser interface
export interface IUser {
  _id?: mongoose.Types.ObjectId | string;
  first_name: string;
  password: string;
  phone: string;
  last_name: string;
  full_name: string;
  display_name: string;
  email: string;
  phone_number: string;
  active_payment_method?: string | null;
  shipping_address: ShippingAddress;
  holds_required: boolean;
  is_banned: boolean;
  role: string;
  matchPassword?: (enteredPassword: string) => Promise<boolean>;
}

// Mongoose schema for ShippingAddress
const shippingAddressSchema = new Schema<ShippingAddress>({
  city: { type: String, required: true },
  country: { type: String, required: true },
  line1: { type: String, required: true },
  line2: { type: String },
  postal_code: { type: String, required: true },
  state: { type: String, required: true },
});

// Mongoose schema for User
const userSchema = new Schema<IUser & Document>(
  {
    email: {
      type: String,
      validate: {
        validator: (email: string) => !email || email.trim().length > 0,
        message: (props: any) => `${props.path} must be a non-empty string`,
      },
      unique: true,
    },
    phone: {
      type: String,
      validate: {
        validator: (phone: string) => !phone || phone.trim().length > 0,
        message: (props: any) => `${props.path} must be a non-empty string`,
      },
    },
    password: { type: String, required: false },
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    full_name: { type: String, required: false },
    display_name: { type: String, required: true },
    active_payment_method: { type: String, default: null },
    shipping_address: { type: shippingAddressSchema, required: false },
    holds_required: { type: Boolean, required: true, default: false },
    is_banned: { type: Boolean, required: true, default: false },
    role: { type: String, lowercase: true, default: "user" },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next: any) {
  if (this.password) {
    if (!this.isModified("password")) {
      return next();
    }
    try {
      this.password = bcrypt.hashSync(this.password as string, 10);
      next();
    } catch (error) {
      console.error("Error hashing password:", error);
      next(error);
    }
  } else {
    next();
  }
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  try {
    const isMatch = bcrypt.compareSync(enteredPassword, this.password);
    return isMatch;
  } catch (error) {
    console.error("Error comparing password:", error);
    return false;
  }
};

userSchema.plugin(mongoosePaginate);
userSchema.plugin(aggregatePaginate);

interface IUserModel extends IUser {}

interface UserModel<T extends Document> extends IPaginateModel<T> {}

export const userModel = model<IUserModel & Document>(
  "User",
  userSchema,
  "Users"
) as UserModel<IUserModel & Document>;

export { UserModel, userModel as default };
