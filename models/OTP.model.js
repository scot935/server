import { Schema, model } from "mongoose";

const OTPSchema = Schema({
  OTP: {
    type: String,
    required: true,
  },
  for: {
    type: String,
    enum: ["forgotPassword", "register"],
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, required: true, default: new Date(), expires: 600 },
});

const OTP = model("OTP", OTPSchema);

export default OTP;
