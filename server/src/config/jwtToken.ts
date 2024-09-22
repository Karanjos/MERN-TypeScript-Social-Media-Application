import jwt from "jsonwebtoken";

const generateAccessToken = (
  id: string,
  email: string,
  role: string
): string => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "1d",
  });
};

export default generateAccessToken;
