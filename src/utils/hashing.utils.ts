import bcrypt from "bcrypt";
import { ApiError } from "./ApiError";

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new ApiError(500, "Password comparison failed");
  }
};
