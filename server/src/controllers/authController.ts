import { IUser, IDecodedToken, IReqAuth } from "../types/types";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

import User from "../models/user.model";
import generateAccessToken from "../config/jwtToken";
import generateRefreshToken from "../config/generateRefreshToken";

export const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { fullName, username, email, password, avatar } = req.body;

      console.log(
        "🚀 ~ file: authController.ts ~ line 15 ~ registerUser ~ req.body",
        req.body
      );

      if (
        [fullName, username, email, password].some(
          (field) => field?.trim() === ""
        )
      ) {
        res.status(400).json({ message: "Please Fill In All Fields!" });
      }

      const newUsername = username.toLowerCase().replace(/ /g, "");

      const existingUser = await User.find({
        $or: [{ username: newUsername }, { email }],
      });

      if (existingUser && existingUser.length > 0) {
        res.status(400).json({
          message: "User or Email Already Exists, Please Try Another One!",
        });
      }

      if (password.length < 6) {
        res
          .status(400)
          .json({ message: "Password must be at least 6 characters long!" });
      } else {
        const newUser = new User({
          fullName,
          username: newUsername,
          email,
          password,
          avatar,
        });

        await newUser.save();

        const accessToken = generateAccessToken(
          newUser?._id,
          newUser?.email,
          newUser?.role
        );
        const refreshToken = generateRefreshToken(
          newUser?._id,
          newUser?.email,
          newUser?.role
        );

        const updateUser = await User.findByIdAndUpdate(
          { _id: newUser._id },
          {
            token: refreshToken,
          },
          { new: true }
        );

        res
          .status(201)
          .cookie("refreshtoken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 360 * 60 * 60 * 1000, // 15 days
          })
          .cookie("accesstoken", accessToken)
          .json({
            message: "User Registered Successfully!",
            user: updateUser,
          });
      }
    } catch (error: any) {
      console.log(
        "🚀 ~ file: authController.ts ~ line 89 ~ registerUser ~ error",
        error
      );
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    console.log(
      "🚀 ~ file: authController.ts ~ line 100 ~ loginUser ~ req.body",
      req.body
    );

    try {
      const { email, username, password } = req.body;

      if ([email, username, password].some((field) => field?.trim() === "")) {
        res.status(400).json({ message: "Please Fill In All Fields!" });
        return;
      }

      const user = await User.findOne({
        $or: [{ email }, { username }],
      }).select("+password");

      if (!user) {
        res.status(400).json({ message: "User Does Not Exist!" });
        return;
      }

      const isPasswordMatch = bcrypt.compareSync(password, user.password);

      if (!isPasswordMatch) {
        res.status(400).json({ message: "Invalid Password!" });
        return;
      }
      const accessToken = generateAccessToken(
        user?._id,
        user?.email,
        user?.role
      );
      const refreshToken = generateRefreshToken(
        user?._id,
        user?.email,
        user?.role
      );

      console.log(accessToken, refreshToken);

      const updateUser = await User.findByIdAndUpdate(
        { _id: user._id },
        {
          token: refreshToken,
        },
        { new: true }
      ).populate(
        "followers following",
        "fullName username avatar followers following"
      );

      if (!updateUser) {
        res.status(400).json({ message: "Login Failed!" });
        return;
      }
      res
        .status(200)
        .cookie("refreshtoken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/api/auth/refresh",
          maxAge: 360 * 60 * 60 * 1000,
        })
        .cookie("accesstoken", accessToken)
        .json({
          message: "Login Successful!",
          user: updateUser,
        });
    } catch (error: any) {
      console.log(
        "🚀 ~ file: authController.ts ~ line 168 ~ loginUser ~ error",
        error
      );
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
);
