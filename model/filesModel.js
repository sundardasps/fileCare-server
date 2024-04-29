import { Timestamp } from "mongodb";
import mongoose, { Schema } from "mongoose";

const fileSchema = mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
    uniqueId: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const fileModel = mongoose.model("fileModel", fileSchema);

export default fileModel;
