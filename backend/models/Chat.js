import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ChatSchema = new Schema(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);
