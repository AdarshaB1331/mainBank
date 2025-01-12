import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Types, Document } from "mongoose";
import SignUp from "../model/SignUp.model";

// Define the user interface that matches your MongoDB schema
interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  role: string;
  profilePic: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

// Define the authenticated request interface
interface AuthenticatedRequest extends Request {
  user?: IUser;
  cookies: {
    [key: string]: string;
  };
}

// Define the JWT decoded payload interface
interface Decoded extends JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

export const protectRoute = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.cookies["user"];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const SECRET_KEY = process.env.SECRET_KEY;
    if (!SECRET_KEY) {
      return res.status(500).json({ message: "Unauthorized" });
    }

    const decoded: Decoded = jwt.verify(token, SECRET_KEY) as Decoded;

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const user = await SignUp.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Convert Mongoose document to plain object and type cast it
    req.user = user.toObject() as IUser;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
