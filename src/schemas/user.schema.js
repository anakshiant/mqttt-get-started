import mongoose from "mongoose";
import uuid from "uuid";
import * as constants from "../lib/constant";

const User = new mongoose.Schema(
  {
    userId: { type: String, default: uuid.v1 },
    name: { type: String },
    email: {
      type: String,
      unique: true
    },
    password: {
      type: String
    },

    statusFlag: {
      type: Boolean,
      default: true
    },
    createdAt: { type: Date, default: null },
    updatedAt: { type: Date, default: null }
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

export default User;
