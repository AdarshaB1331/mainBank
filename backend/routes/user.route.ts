import express from "express";
import {
  createUserInformation,
  deleteUser,
  getAllUserInformation,
  getCurrentUser,
  getUserInformation,
  updateSignUpUser,
  updateUser,
  uploadImage,
  updateProfilePicture,
  getSignUpUsers,
  deleteSignUpUser,
} from "../controller/User.controller";
import { protectRoute } from "../middeware/auth.middleware";

const router = express.Router();

router.get("/userInformation/:name", getUserInformation);
router.post("/createUser", createUserInformation);
router.get("/allUsers", getAllUserInformation);
router.delete("/deleteUser/:id", deleteUser);
router.put("/updateUser/:id", updateUser);
router.get("/currentUser", protectRoute, getCurrentUser);
router.put("/updateSignUpUser/:id", updateSignUpUser);
router.post("/upload", uploadImage);
router.put("/updateProfilePicture", protectRoute, updateProfilePicture);
router.get("/getSignUpUsers", getSignUpUsers);
router.delete("/deleteSignUpUser/:id", deleteSignUpUser);
export default router;
