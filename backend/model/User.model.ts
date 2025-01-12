import mongoose from "mongoose";
export interface IUsers {
  name: string;
  age: string;
  address: string;
  gender: string;
  skills: string;
}
export interface IUserModel extends IUsers, Document {}
const userSchema = new mongoose.Schema<IUserModel>(
  {
    name: {
      type: String,
    },
    age: {
      type: String,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
    },
    skills: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUserModel>("User", userSchema);

export default User;
