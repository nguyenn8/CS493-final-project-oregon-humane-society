/*
 * API sub-router for businesses collection endpoints.
 */

const router = require("express").Router();
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");

const {
  validateAgainstSchema,
  extractValidFields,
} = require("../lib/validation");
const {
  PhotoSchema,
  insertNewPhoto,
  getPhotoById,
} = require("../models/photo");

const { getChannel } = require("../lib/rabbitmq");

/*
 * Excepted file formats.
 */
const acceptedFileTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
};

/*
 * Write images to disk. This is an intermediate step before we write them to GridFS.
 */
const upload = multer({
  storage: multer.diskStorage({
    destination: `${__dirname}/../uploads`,
    filename: (req, file, callback) => {
      const filename = crypto.pseudoRandomBytes(16).toString("hex");
      const extension = acceptedFileTypes[file.mimetype];
      callback(null, `${filename}.${extension}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    callback(null, !!acceptedFileTypes[file.mimetype]);
  },
});

/*
 * Route to create a new photo.
 */
router.post("/", upload.single("photo"), async (req, res, next) => {
  if (validateAgainstSchema(req.body, PhotoSchema) && req.file) {
    photo = {
      contentType: req.file.mimetype,
      filename: req.file.filename,
      path: req.file.path,
      animalId: req.body.animalId,
    };
    if (req.body.caption) {
      photo.caption = req.body.caption;
    }
    try {
      const id = await insertNewPhoto(photo);
      //await fs.unlink(req.file.path);
      res.status(200).send({
        id: id,
      });
      const channel = getChannel();
      channel.sendToQueue("photos", Buffer.from(id.toString()));
    } catch (err) {
      next(err);
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid photo object",
    });
  }
});

/*
 * Route to fetch info about a specific photo.
 */
router.get("/:id", async (req, res, next) => {
  try {
    const photo = await getPhotoById(req.params.id);
    if (photo) {
      base = "/media/photos/" + photo._id + "-";
      urls = {};
      if (photo.metadata.resolutions["1024"]) {
        s = base + "1024.jpg";
        urls["1024"] = s;
      }
      if (photo.metadata.resolutions["640"]) {
        s = base + "640.jpg";
        urls["640"] = s;
      }
      if (photo.metadata.resolutions["256"]) {
        s = base + "256.jpg";
        urls["256"] = s;
      }
      if (photo.metadata.resolutions["128"]) {
        s = base + "128.jpg";
        urls["128"] = s;
      }
      s = base + "orig." + acceptedFileTypes[photo.metadata.contentType];
      urls.orig = s;

      const resBody = {
        _id: photo._id,
        filename: photo.filename,
        metadata: photo.metadata,
        urls: urls,
      };
      res.status(200).send(resBody);
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
