import SignUp from "../model/SignUp.model";
import User from "../model/User.model";
import { Request, Response } from "express";
import cloudinary from "../lib/cloudinary";

declare global {
  namespace Express {
    interface Request {
      file?: {
        filename: string;
        path?: string;
        [key: string]: any;
      };
    }
  }
}
interface createUserInformation {
  name: string;
  age: string;
  address: string;
  gender: string;
  skills: string;
}

interface reqUserObject {
  _id: string;
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
// Extend the Request interface to include the `user` property
interface AuthenticatedRequest extends Request {
  user?: reqUserObject;
}

interface updateSignUpUsers {
  name: string;
  email: string;
  isActive: boolean;
  role: string;
}
interface TypedRequestBody<T> extends Request {
  body: T;
}
type TypedRequest<T> = Request & { params: T };
interface idInParams {
  id: string;
}

export const getUserInformation = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    // Use a case-insensitive regular expression to match names starting with the specified letter
    const userInformation = await User.find({
      name: { $regex: `^${name}`, $options: "i" },
    });

    if (!userInformation || userInformation.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({ userInformation });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createUserInformation = async (
  req: TypedRequestBody<createUserInformation>,
  res: Response
): Promise<any> => {
  try {
    const { name, age, address, gender, skills } = req.body;

    if (!name || !age || !address || !gender || !skills) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const newUser = await User.create({
      name,
      age,
      address,
      gender,
      skills,
    });

    return res.status(201).json({ newUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getAllUserInformation = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const allUserInformation = await User.find({});
    if (!allUserInformation) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(allUserInformation);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const deleteUser = async (
  req: TypedRequest<idInParams>,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const deleteUser = await User.findByIdAndDelete(id);

    if (!deleteUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User deleted successfully", deleteUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateUser = async (
  req: TypedRequest<idInParams> & TypedRequestBody<createUserInformation>,
  res: Response
): Promise<any> => {
  try {
    const { name, age, address, gender, skills } = req.body;
    const { id } = req.params;
    const trimmedId = id.trim();
    const updateUser = await User.findByIdAndUpdate(
      trimmedId,
      {
        name,
        age,
        address,
        gender,
        skills,
      },
      { new: true }
    );

    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ updateUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    return res.json(req.user);
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Internal Server Error" });
  }
};
export const updateSignUpUser = async (
  req: TypedRequest<idInParams> & TypedRequestBody<updateSignUpUsers>,
  res: Response
): Promise<any> => {
  try {
    const { name, email, isActive, role } = req.body;

    const { id } = req.params;

    if (!name || !email || isActive === undefined || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const trimmedId = id.trim();
    const isActives = isActive.toString() === "true";

    const updateUser = await SignUp.findByIdAndUpdate(
      trimmedId,
      { name, email, isActive: isActives, role },
      { new: true }
    );

    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ updateUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const uploadImage = async (
  req: Request,
  res: Response
): Promise<any> => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  return res.status(200).json({
    file: {
      path: `/images/${req.file.filename}`,
    },
  });
};

// Controller function with proper typing
export const updateProfilePicture = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let profilePic = req.body.profilePicture || ""; // Default to empty if not provided

    if (profilePic) {
      // Upload to Cloudinary if profilePicture is provided in the request
      const result = await cloudinary.uploader.upload(profilePic);
      profilePic = result.secure_url; // Get the uploaded picture URL
    }

    // Update user profile picture
    const user = await SignUp.findByIdAndUpdate(
      req.user._id,
      { profilePic },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in updateProfilePicture controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getSignUpUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const allUserInformation = await SignUp.find({});
    if (!allUserInformation) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(allUserInformation);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteSignUpUser = async (
  req: TypedRequest<idInParams>,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const trimmedId = id.trim();
    const deleteUser = await SignUp.findByIdAndDelete(trimmedId);
    if (!deleteUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
