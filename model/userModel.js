import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  verifyOtp: {
    type: String,
  },
  // userFiles: {
  //   type: Array,
  //   default: [],
  // },
  isVerified:{
    type:Boolean,
    default:false
  }
});

const userModel = mongoose.model("userModel", userSchema);

export default userModel;
