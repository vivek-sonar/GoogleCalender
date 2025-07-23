import mongoose from "mongoose";

const { Schema } = mongoose;

const NoticeSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },

    // References
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: null },
    scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule", default: null },

    // Start and End time (HH:mm format)
    startTime: {
      type: String,
      
    },
    endTime: {
      type: String,
      
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notice", NoticeSchema);
