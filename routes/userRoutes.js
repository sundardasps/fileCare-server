import express from "express";
import { login, otpVerification, register, resendOTP } from "../controllers/userAuth.js";
import upload from "../middlewares/multer.js";
import { deleteFile, downloadFile, fetchFiles, uploadFile,checkFile } from "../controllers/userControllers.js";
import auth from "../middlewares/auth.js";


const userRoute = express();



userRoute.post("/login",login);
userRoute.post("/register",register);
userRoute.get("/otpVerify/:otp/:email",otpVerification);
userRoute.get("/resendOtp/:email",resendOTP);
userRoute.post("/uploadFile",auth,upload.single("file"),uploadFile);
userRoute.get("/fetchFiles",auth,fetchFiles);
userRoute.get("/deleteFile/:fileId",auth,deleteFile);
userRoute.get("/downloadFile/:uniqueId",downloadFile);
userRoute.get("/checkFile/:uniqueId",checkFile);

export default userRoute;
