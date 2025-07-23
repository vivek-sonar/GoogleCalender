import mongoose from "mongoose";

const { Schema } = mongoose;

const ScheduleSchema = new Schema(
  {

     schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

   
    // Link this schedule slot to a specific Event
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
// Notice reference
         noticeId: { type: mongoose.Schema.Types.ObjectId, ref: "Notice", default: null },


    // Full start + end datetime for the scheduled slot
    startAt: {
      type: String,
      
    },
    endAt: {
      type: String,
      
    },

    // Optional status/notes if needed later
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    note: {
      type: String,
     
    },
  },
  {
    timestamps: true, 
  }
);



// Validate end > start


// ScheduleSchema.pre("save", function (next) {
//   if (this.endAt <= this.startAt) {
//     return next(new Error("endAt must be after startAt"));
//   }
//   next();
// });



// Same validation when using findOneAndUpdate / update


// ScheduleSchema.pre("findOneAndUpdate", function (next) {
//   const update = this.getUpdate();
//   const start = update.startAt ?? update.$set?.startAt;
//   const end = update.endAt ?? update.$set?.endAt;

//   if (start && end && end <= start) {
//     return next(new Error("endAt must be after startAt"));
//   }
//   next();
// });

export default mongoose.model("Schedule", ScheduleSchema);
