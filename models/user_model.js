import { Schema, Types, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";
import mongooseErrors from "mongoose-errors";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: "user",
      enum: ["superadmin", "admin", "manager", "user"],
    },
  },
  {
    timestamps: true,
  }
);

const resetTokenSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: true, ref: "User" },
    expired: { type: Boolean, default: false },
    expiresAt: {
      type: Date,
      default: () => new Date().setHours(new Date().getHours() + 2),
    },
  },
  {
    timestamps: true,
  }
);

// Apply plugins
userSchema.plugin(mongooseErrors).plugin(toJSON);

resetTokenSchema.plugin(mongooseErrors).plugin(toJSON);

// Export models
export const UserModel = model("User", userSchema);
export const ResetTokenModel = model("ResetToken", resetTokenSchema);
