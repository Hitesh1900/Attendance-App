import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { User } from "../models/userModel.js"; // Directly import User model
require("dotenv").config();

const register = async (name, email, password) => {
  const hashedPassword = await hash(password, 10);
  return await User.create({ name, email, password: hashedPassword });
};

const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }
  return sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export default { register, login };
