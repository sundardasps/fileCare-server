import jwt from "jsonwebtoken";
import fs from "fs";
import userDatabase from "../model/userModel.js";

const auth = async (req, res, next) => {
  try {
    
 
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const decode = jwt.verify(token,process.env.JWT_SECRET);
      const user = await userDatabase.findOne({ _id: decode.userId });
      if (user) {
        req.headers.userId = user._id;
        next();
      } else {
        return res
          .status(403)
          .json({ message: "User not authorised or inavid user!" });
      }
    } else {
      return res.status(403).json({ message: "User not authorized!" });
    }
  } catch (error) {
    console.log(error);
  }
};

export default auth;
