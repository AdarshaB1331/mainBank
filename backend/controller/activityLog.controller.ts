import { Types } from "mongoose";
import { Request, Response } from "express";
import ActivityLog from "../model/ActivityLog.model";

type activityLogBody = {
  action: "created" | "deleted" | "updated";
  user: Types.ObjectId;

  target: Types.ObjectId;
  targetName: string;
};

export const addActivityLog = async (
  req: Request<{}, {}, activityLogBody & { targetName: string }>,
  res: Response
): Promise<any> => {
  try {
    const { action, user, target, targetName } = req.body;

    if (!action || !user || !target || !targetName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const activityLog = new ActivityLog({
      action,
      user,
      target: {
        id: target,
        name: targetName,
      },
    });

    await activityLog.save();

    return res.status(201).json({
      message: "Activity log successfully created",
    });
  } catch (error) {
    console.error(
      "Error in addActivityLog: ",
      error instanceof Error ? error.message : error
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getActivityLog = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const activityLogs = await ActivityLog.find({})
      .populate({
        path: "user",
        select: "name ",
      })
      .populate({
        path: "target",
        select: "name",
      });
    if (activityLogs) {
      return res.status(200).json(activityLogs);
    }
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ message: "Error fetching activity logs", error });
  }
};
