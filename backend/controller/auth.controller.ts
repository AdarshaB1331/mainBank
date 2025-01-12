import { Request, Response } from "express";
import SignUp from "../model/SignUp.model";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
dotenv.config();
interface UserDocument extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
}

interface SignUpBody {
  name: string;
  email: string;
  password: string;
}
interface LoginBody {
  email: string;
  password: string;
}
interface TypedRequestBody<T> extends Request {
  body: T;
}
export const signUp = async (
  req: Request<{}, {}, SignUpBody>,
  res: Response
): Promise<any> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmail = await SignUp.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await SignUp.findOne({ name });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new SignUp({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    if (!process.env.SECRET_KEY) {
      return res.status(500).json({ message: "Error" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "3d",
    });
    res.cookie("user", token, {
      secure: false,
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(
      "Error in signup: ",
      error instanceof Error ? error.message : error
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const LogIn = async (
  req: TypedRequestBody<LoginBody>,
  res: Response
): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await SignUp.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (!user.password) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!process.env.SECRET_KEY) {
      console.error("SECRET_KEY is not defined");
      return res
        .status(500)
        .json({ message: "Internal server error: SECRET_KEY not defined" });
    }
    if (!user.isActive) {
      return res.status(401).json({ message: "User is not active " });
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "3d",
    });

    res.cookie("user", token, {
      secure: false,
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(201).json({ user });
  } catch (error) {
    console.log(
      "Error in signup: ",
      error instanceof Error ? error.message : error
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logOut = async (req: Request, res: Response): Promise<any> => {
  try {
    res.clearCookie("user");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
