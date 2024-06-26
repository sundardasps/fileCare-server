import cloudinary from "cloudinary";
import { config } from "dotenv";
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadToCloudinary = async (path, folder ) => {
  try {
    const data = await cloudinary.v2.uploader.upload(path, { folder });
    return { url: data.url, public_id: data.public_id };
  } catch (error) {
   
      next(error)
    
  }
};


export default uploadToCloudinary