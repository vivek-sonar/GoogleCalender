import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User"  },
   text: { type: [String]},
},
 {
    timestamps: true,
  }

);

export default mongoose.model('Message', messageSchema);
