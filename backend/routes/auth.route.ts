import express from "express";
import { LogIn, logOut, signUp } from "../controller/auth.controller";
import { protectRoute } from "../middeware/auth.middleware";

const router = express.Router();

router.post("/signUp", signUp);
router.post("/logout", protectRoute, logOut);
router.post("/login", LogIn);

export default router;
