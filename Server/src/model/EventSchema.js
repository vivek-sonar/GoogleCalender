import mongoose from "mongoose";

const EventSchema = mongoose.Schema({
    event_name: {
        type: String,
        required: true
    },
    event_location: {
        type: String,
    },

    eventDate: { type: Date, default: new Date() },
    eventTime: {
        type: String,
        default: () => {
            const now = new Date();
            return now.toTimeString().split(" ")[0];  // "HH:MM:SS"
        },
    },
    eventNote: {
        type: String,
        required: true

    },


    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

}

    , {
        timestamps: true
    })

export default mongoose.model("Event", EventSchema);

