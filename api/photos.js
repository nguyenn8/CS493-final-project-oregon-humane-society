/*
 * API sub-router for businesses collection endpoints.
 */

const { requireAuthentication } = require("../lib/auth");
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
  getPhotoStreamById,
} = require("../models/photo");

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
router.post(
  "/",
  requireAuthentication,
  upload.single("photo"),
  async (req, res, next) => {
    console.log("Posting...");
    if (validateAgainstSchema(req.body, PhotoSchema) && req.file) {
      console.log("validated photos");
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
        console.log("attempting to insert");
        const id = await insertNewPhoto(photo);
        //await fs.unlink(req.file.path);
        res.status(200).send({
          id: id,
        });
      } catch (err) {
        next(err);
      }
    } else {
      res.status(400).send({
        error: "Request body is not a valid photo object",
      });
    }
  }
);

/*
 * Route to fetch info about a specific photo.
 */
router.get("/:id", async (req, res, next) => {
  try {
    const photo = await getPhotoById(req.params.id);
    if (photo) {
      getPhotoStreamById(req.params.id)
        .on("error", (err) => {
          if (err.code === "ENOENT") {
            next();
          } else {
            next(err);
          }
        })
        .on("file", (file) => {
          res.status(200).type(file.metadata.contentType);
        })
        .pipe(res);
      return;
      // const resBody = {
      //   _id: photo._id,
      //   filename: photo.filename,
      //   metadata: photo.metadata,
      // };
      // res.status(200).send(resBody);
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
