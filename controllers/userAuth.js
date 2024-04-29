import userDatabase from "../model/userModel.js";
import sendMail from "../utils/nodeMailer.js";
import passwordHasher from "../utils/passwordHasher.js";
import bcrypt from "bcryptjs";
import { jwtTokenGenarator } from "../utils/tokens.js";
import { OtpGenarator } from "../utils/uniqueNumGenarator.js";

export const register = async (req, res) => {
  try {
    const { userName, password, email } = req.body;
    const exist = await userDatabase.findOne({ userEmail: email });
    const hashedpass = await passwordHasher(password);
    const uniqNumber = OtpGenarator()
    if (exist) {
      return res
        .status(200)
        .json({ message: "The email you provided is already registered." });
    } else {
      const user = new userDatabase({
        userName: userName.trim(),
        userEmail: email,
        userPassword: hashedpass,
        verifyOtp: uniqNumber,
      });

      if (user) {
        const userData = await user.save();
        sendMail(email, "Verification mail", userData.verifyOtp);
        return res.status(200).json({
          created: true,
          message: "Please confirm the email that was sent to your account.",
        });
      }
    }
  } catch (error) {}
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exist = await userDatabase.findOne({ userEmail: email });
    if (exist) {
      const passMatch = await bcrypt.compare(password, exist.userPassword);
      if (passMatch) {
        if (exist.isVerified) {
          const jwtToken = await jwtTokenGenarator(exist._id);
          return res.status(200).json({
            loginData: exist,
            loginSuccess: true,
            message: "Login Successfully",
            jwtToken,
          });
        } else {
          const otp =  OtpGenarator()
          const updated = await userDatabase.findOneAndUpdate(
            {
              userEmail: email,
            },
            { $set: { verifyOtp: otp } }
          );

          if (updated) {
            sendMail(email, "Varification mail", otp);
            return res.status(200).json({
              created: true,
              message:
                "Your account is not verified; an email has been sent to your account. Please click the link to verify.",
            });
          }
        }
      } else {
        res.json({
          message: "The password you entered is incorrect.",
        });
      }
    } else {
      res.json({ message: "The entered email addresses do not match." });
    }
  } catch (error) {}
};

export const otpVerification = async (req, res) => {
  try {
    const { email, otp } = req.params;
    const verified = await userDatabase.findOne({ userEmail: email });
    if (verified) {
      if (verified.verifyOtp === otp) {
        await userDatabase.findOneAndUpdate(
          { userEmail: email },
          { $set: { isVerified: true, verifyOtp: "" } }
        );
        return res
          .status(200)
          .json({ loginSuccess: true, message: "Login successfully" });
      } else {
        return res.json({
          loginSuccess: false,
          message: "Invalid OTP.",
        });
      }
    } else {
      return res.json({
        loginSuccess: false,
        message: "The entered email addresses do not match.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.params;
    const varified = await userDatabase.findOne({ userEmail: email });
    
    if (varified) {
      const randomNum = OtpGenarator()
      const updated = await userDatabase.findOneAndUpdate(
        { userEmail: email },
        { $set: { verifyOtp: randomNum } }
      );
      if (updated) {
        sendMail(email, "Verification mail", randomNum);
        return res.status(200).json({
          loginSuccess: true,
        });
      }
    } else {
      return res.json({
        loginSuccess: false,
        message: "The entered email addresses do not match.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};


