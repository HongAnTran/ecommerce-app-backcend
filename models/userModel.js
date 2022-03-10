import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: String,
    phoneShop: String,
    address: [Object],
    uid: {
      type: String,
      required: true,
    },
    providerId: String,
    photoURL: String,
    isSeller: {
      type: Boolean,
      default: false,
    },
    deliveryAddress: String,
    country: String,
    itemsMain: String,
    shopName: String,
    bill:Object,
    coin:{
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("users", userSchema);
