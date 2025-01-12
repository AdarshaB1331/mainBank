import mongoose, { Document, Schema, Types } from "mongoose";

// Interface definitions
export interface IActivityLogModel {
  action: "created" | "deleted" | "updated";
  user: Types.ObjectId;
  target: {
    id: Types.ObjectId;
    name: string;
  };
}

export interface ActivityLogDocument extends IActivityLogModel, Document {}

const activityLogSchema = new Schema(
  {
    action: {
      type: String,
      enum: ["created", "deleted", "updated"],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId, // Direct reference to SignUp model
      ref: "SignUp",
      required: true,
    },
    target: {
      id: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

const ActivityLog = mongoose.model<ActivityLogDocument>(
  "ActivityLog",
  activityLogSchema
);

export default ActivityLog;
