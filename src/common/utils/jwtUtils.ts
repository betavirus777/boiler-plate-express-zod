import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const generateAccessToken = async (data: Object) => {
  const expiresIn = "1hr";
  const accessToken = jwt.sign(
    data,
    process.env.JWT_ACCESS_SECRET as jwt.Secret,
    { expiresIn }
  );
  return accessToken;
};

export const generateRefreshToken = async (data: Object) => {
  const expiresIn = "168hr";
  const refreshToken = jwt.sign(
    data,
    process.env.JWT_REFRESH_SECRET as jwt.Secret,
    { expiresIn }
  );
  return refreshToken;
};

export default jwt;
