const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        }
    }
)



const OTP = mongoose.model("OTP", otpSchema)
module.exports = OTP