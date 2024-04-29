import jwt from "jsonwebtoken";

export const jwtTokenGenarator = async (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};
