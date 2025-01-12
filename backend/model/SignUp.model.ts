import mongoose from "mongoose";
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: string;
  profilePic: string;
  isActive: boolean;
}
export interface IUserModel extends IUser, Document {}
const signUpSchema = new mongoose.Schema<IUserModel>(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: "String",
      default: "user",
    },
    profilePic: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX9bbKwKl3iZQjbCvCaUOnyPbc3Z8SfcpsJ0YoJi1efD7N5crA8QN8R4k&s",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const SignUp = mongoose.model<IUserModel>("SignUp", signUpSchema);

export default SignUp;
