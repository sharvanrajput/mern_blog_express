import { sendmail } from "../config/nodemailer.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudnary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, password } = req.body

        if ([fullname, email, password].some((filed) => !filed.trim() === "")) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "User Already Exist" })
        }

        const user = await User.create({ fullname, email, password })

        console.log(user)

        const token = user.generateAcccessToken()

        const options = {
            httpOnly: false, // allow JS to read
            secure: false,   // for localhost
            sameSite: "lax",
            path: "/"
        }

        res.status(201).cookie("token", token, options).send({ success: true, user, token, message: `User Register Successfully` })

    } catch (error) {
        return res.status(500).send({ success: false, message: ` register  Internal Server Error ${error.message}` })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email?.trim() || !password?.trim()) return res.status(400).json({ success: false, message: "All fields are required" })

        const user = await User.findOne({ email })

        if (!user) return res.status(400).json({ success: false, message: "User not found" })

        const checkpassword = await user.isPasswordCorrect(password)

        if (!checkpassword) return res.status(400).json({ success: false, message: "Incrroct Password" })

        const token = user.generateAcccessToken()

        const options = {
            httpOnly: false, // allow JS to read
            secure: false,   // for localhost
            sameSite: "lax",
            path: "/"
        }

        res.status(200).cookie("token", token, options).send({ success: true, user, token: token, message: "User Login Successfully" })

    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error ${error.message}` })
    }
}
export const Googlelogin = async (req, res) => {
    try {
        const { fullname, email, profile } = req.body

        // ✅ Check if user exists
        let user = await User.findOne({ email });

        // ✅ If not exists, create user (no password)
        if (!user) {
            user = await User.create({
                fullname,
                email,
                profile,
                password: "google_auth_user", // dummy password to avoid required error
            });
        }
        const token = user.generateAcccessToken()

        const options = {
            httpOnly: false, // allow JS to read
            secure: false,   // for localhost
            sameSite: "lax",
            path: "/"
        }

        res.status(200).cookie("token", token, options).send({ success: true, user, token: token, message: "User Login Successfully" })

    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error ${error.message}` })
    }
}

export const logout = async (req, res) => {
    try {

        res.status(200).clearCookie("token").send({ success: true, message: "Logout successfully" })

    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error ${error.message}` })
    }
}

export const forgotPassword = async (req, res) => {
    try {

        const { email } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found " })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 5 * 60 * 1000
        user.passwordOtp = otp
        user.otpExpiry = otpExpiry

        await user.save({ validateBeforeSave: true })

        const mailsend = await sendmail({ email, otp })
        console.log("mail send res", mailsend)

        if (!mailsend) return res.status(500).json({ success: false, message: "Failed to send OTP email" });


        res.status(200).json({ success: true, message: "OTP sent successfully ✅ , check your email", otp });

    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error ${error.message}` })
    }
}

export const enterPassotp = async (req, res) => {
    try {

        const { otp, email } = req.body


        const user = await User.findOne({ email })
        if (Date.now() > user.otpExpiry) return res.status(400).send({ success: false, message: "enter otp timeup" })
        if (otp !== user.passwordOtp) return res.status(400).send({ success: false, message: "Wrong otp!! enter again" })

        user.passwordOtp = ""
        user.otpExpiry = 0
        user.isOtpverified = true
        await user.save({ validateBeforeSave: true })

        res.status(200).send({ success: true, message: "otp verifyed successfully " })

    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
    }
};

export const resetPassword = async (req, res) => {
    try {

        const { password, email } = req.body
        const user = await User.findOne({ email })

        if (!user.isOtpverified) return res.status(400).send({ success: false, message: "Otp not verified" })

        user.password = password
        user.isOtpverified = false

        await user.save({ validateBeforeSave: true })

        res.status(200).send({ success: true, message: "password update success fully" })


    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const { id } = req.user; // From verifyJwt middleware
        const { fullname, email, bioData } = req.body;

        const profilepath = req.file ? req.file.path : undefined;

        const profile = await uploadOnCloudinary(profilepath)



        // Prepare update data
        const updatedData = { fullname, email, bioData };

        if (profile) updatedData.profile = profile.url;

        // Update user data
        const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            success: false,
            message: `Internal Server Error: ${error.message}`,
        });
    }
};


export const currentuser = async (req, res) => {
    try {

        const { id } = req.user
        const user = await User.findById(id).select("-password -passwordOtp -otpExpiry -isOtpverified")
        res.status(200).send({ success: true, message: "current user find successfully", user })

    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
    }
};

export const alluser = async (req, res) => {
    try {

        const users = await User.find()
        res.status(200).send({ success: true, message: "all users find successfully", users })

    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
    }
};

export const useratatustoggle = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findById(id)

        const userstate = user.userstatus === "active" ? "deactive" : "active"

        user.userstatus = userstate

        await user.save()

        res.status(200).send({ success: true, message: "all users find successfully", user })

    } catch (error) {
        return res.status(500).send({ success: false, message: `Internal Server Error: ${error.message}` });
    }
};

