import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({

    fullname: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    bioData: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true
    },
    passwordOtp: {
        type: String,
        default: ""
    },
    otpExpiry: {
        type: Number,
        default: 0
    },
    isOtpverified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    userstatus: {
        type: String,
        default: "active",
        enum: ["active", "deactive"]
    },
    profile: {
        type: String,
        default: ""
    }


}, { timestamps: true })


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAcccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECREAT, { expiresIn: "1d" })
}




export const User = mongoose.model("User", userSchema)

