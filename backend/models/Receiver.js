import mongoose from "mongoose";

const receiverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    bloodGroupNeeded: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: { type: String, default: "pending" },
    email: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  },
  { timestamps: true }
);

export default mongoose.model("Receiver", receiverSchema);
