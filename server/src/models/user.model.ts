import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../types/types";
import crypto from "crypto";

const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
      default: "https://www.gravatar.com/avatar/000?d=mp",
    },
    role: {
      type: String,
      default: "USER",
      enum: ["USER", "ADMIN"],
    },
    gender: {
      type: String,
      default: "MALE",
      enum: ["MALE", "FEMALE", "OTHER"],
    },
    mobile: { type: String, default: "" },
    address: { type: String, default: "" },
    story: {
      type: String,
      default: "",
      maxlength: 200,
    },
    website: { type: String, default: "" },
    faceBookId: { type: String, default: "" },
    followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    post: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
    saved: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
    passwordResetExpires: Number,
    passwordResetToken: String,
    token: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

userSchema.methods.isPasswordMatch = async function (
  enteredPassword: string
): Promise<boolean> {
  console.log(this);

  console.log(enteredPassword, this.password);
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  console.log(isMatch);

  return isMatch;
};

userSchema.methods.createPasswordResetToken =
  async function (): Promise<string> {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
    return resetToken;
  };

const User = mongoose.model<IUser>("User", userSchema);

export default User;
