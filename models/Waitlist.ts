import mongoose from "mongoose";

export interface IWaitlist extends mongoose.Document {
  name?: string;
  mobileNumber: string;
  occupation?: string;
  createdAt: Date;
}

const WaitlistSchema = new mongoose.Schema<IWaitlist>({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  mobileNumber: {
    type: String,
    required: [true, "WhatsApp number is required"],
    unique: true,
    trim: true,
  },
  occupation: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Waitlist || mongoose.model<IWaitlist>("Waitlist", WaitlistSchema);
