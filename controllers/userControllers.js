import fileModel from "../model/filesModel.js";
import uploadToCloudinary from "../utils/cloudinary.js";
import { uniqueNumGenarator } from "../utils/uniqueNumGenarator.js";
import cloudinary from "cloudinary";
import fs from "fs";

export const uploadFile = async (req, res, next) => {
  try {
    const number = uniqueNumGenarator();
    const path = req.file.path;

    const fileName = path.split("_")[1];

    const file = await fileModel({
      userId: req.headers.userId,
      uniqueId: number,
      fileUrl: path,
      fileName:req.body.fileName,
    });

    const saved = await file.save();
    if (saved) {
      return res
        .status(200)
        .json({
          uploaded: true,
          message: `${fileName} File uploaded successfully..`,
        });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await fileModel.findOne({
      _id: fileId,
    });

    const result = await fs.unlink(file.fileUrl, (err) => {
      if (err) console.log(err);
    });
    console.log(result);
    const deleted = await fileModel.findOneAndDelete({ _id: fileId });
    const fileName = deleted.fileUrl.split("_")[1];
    if (deleted) {
      return res
        .status(200)
        .json({
          deleted: true,
          message: `${fileName} File deleted successfully..`,
        });
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchFiles = async (req, res) => {
  try {
    console.log(req.query,"llllllllll........................");
    const {Search,page,filter} =  req.query
    const query = {userId: req.headers.userId}
    const limit = 5;
    let   skip = (page - 1) * 5;
    const count = await fileModel.find(query).countDocuments();
    const totalPages = Math.ceil(count / limit);

  



    if(Search){
      query.$or = [
         {fileName:{$regex:new RegExp(Search,"i")}},
         {uniqueId:{$regex:new RegExp(Search,"i")}},
         {fileUrl:{$regex:new RegExp(Search,"i")}},
      ]
    }



    const files = await fileModel.find(query).sort({
      createdAt:filter==="old"?1:-1,
    }).skip(skip).limit(limit);

    if (files.length > 0) {
      return res.status(200).json({ fetched: true, files ,fileCount:count,totalPages});
    } else {
      return res.status(200).json({ fetched: true, files: [],fileCount:0,totalPages:0 });
    }
  } catch (error) {
    console.log(error);
  }
};

export const downloadFile = async (req, res) => {
  try {

    const file = await fileModel.findOne({ uniqueId: req.params.uniqueId });
    console.log(file.fileUrl);
    if (file) {
      res.download(file.fileUrl);
    } else {
    }
  } catch (error) {
    console.log(error);
  }
};



export const checkFile = async (req, res) => {
  try {
    const file = await fileModel.findOne({ uniqueId: req.params.uniqueId});
    if (file != null) {
      res.status(200).json({url:file.fileUrl,exist:true,file});
    } else {
      return res.status(200).json({exist:false,message:"file not found"})
    }
  } catch (error) {
    console.log(error);
  }
};
