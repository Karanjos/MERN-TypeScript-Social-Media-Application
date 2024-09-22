import mongoose, { Document } from "mongoose";
import { Request } from "express";

export interface IUser extends Document {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  role: string;
  gender: string;
  mobile: string;
  address: string;
  story: string;
  website: string;
  faceBookId: string;
  followers: Array<IUser>;
  following: Array<IUser>;
  post: Array<IPost>;
  saved: Array<IPost>;
  token: string;
  passwordResetExpires: number;
  passwordResetToken: string;
  isPasswordMatch: (password: string) => Promise<boolean>;
  createPasswordResetToken: () => Promise<string>;
}

export interface IPost extends Document {}

export interface INotification extends Document {}

export interface IComment extends Document {}

export interface ILike extends Document {}

export interface IMessage extends Document {}

export interface IConversation extends Document {}

export interface IReqAuth extends Request {}

export interface IDecodedToken {}

export interface ISocket {}

export interface ISendEmail {}
