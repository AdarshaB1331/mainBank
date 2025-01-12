import express from "express";
import {
  addActivityLog,
  getActivityLog,
} from "../controller/activityLog.controller";

const router = express.Router();

router.post("/add", addActivityLog);
router.get("/getLogs", getActivityLog);

export default router;
