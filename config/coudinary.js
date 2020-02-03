const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

var storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "petphoto", // The name of the folder in cloudinary
  allowedFormats: ["jpg", "png"],
  filename: function(req, file, cb) {
    cb(null, file.filename);
  }
});

const uploadCloud = multer({ storage: storage });

module.exports = uploadCloud;
