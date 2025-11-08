import { Router } from "express";
import { enterPassotp, forgotPassword, login, logout, register, resetPassword, updateProfile, currentuser, alluser, useratatustoggle, Googlelogin } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";


const authRoute = Router()

authRoute.post("/register", upload.single("profile"), register)
authRoute.post("/login", login)
authRoute.post("/googlelogin", Googlelogin)
authRoute.post("/logout", verifyJwt, logout)

// update password 
authRoute.post("/forgotPassword", forgotPassword)
authRoute.post("/enterotp", enterPassotp)
authRoute.post("/updatepassword", resetPassword)

// update profile 
authRoute.patch("/updateprofile", verifyJwt, upload.single("profile"), updateProfile)

// current user 
authRoute.get("/currentuser", verifyJwt, currentuser)

// all users
authRoute.get("/alluser", verifyJwt, alluser)

// user status 
authRoute.get("/useratatustoggle/:id", useratatustoggle)



export default authRoute