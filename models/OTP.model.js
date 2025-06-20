const mongoose = require('mongoose')

const OTPSchema = mongoose.Schema(
    {
        OTP: {
            type: String,
            required: true
        },
        for: {
            type: String,
            enum: ['forgotPassword', 'register'],
            required: true
        },
        email: {
            type: String,
            required: true
        },
        createdAt: { type: Date, required: true, default: new Date(), expires: 600 }
    }
)

const OTP = mongoose.model("OTP", OTPSchema)

module.exports = OTP