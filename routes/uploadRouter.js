const express = require("express");
const authenticate = require("../authenticate");
const multer = require("multer");
const cors = require("./cors");

//diskStorage is a multer method for storage, cb=callback function
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.jpg|jpeg|png|gif)$/)) {
    return cb(new Error("You can upload only image files!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

const uploadRouter = express.Router();

uploadRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => (res.sendStatus = 200))
  .get(
    cors.cors,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end("GET operation not supported on /imageUpload");
    }
  )
  .post(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    cors.corsWithOptions,
    upload.single("imageFile"),
    (req, res) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(req.file);
    }
  )
  .put(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    cors.corsWithOptions,
    (req, res) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on /imageUpload");
    }
  )
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    cors.corsWithOptions,
    (req, res) => {
      res.statusCode = 403;
      res.end("DELETE operation not supported on /imageUpload");
    }
  );

module.exports = uploadRouter;
