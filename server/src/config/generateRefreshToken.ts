import jwt from "jsonwebtoken";

const generateRefreshToken = (
  id: string,
  email: string,
  role: string
): string => {
  return jwt.sign(
    { id, email, role },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "15d",
    }
  );
};

export default generateRefreshToken;
