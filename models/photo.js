/*
 * Photo schema and data accessor methods.
 */

const fs = require("fs");
const crypto = require("crypto");
const { ObjectId, GridFSBucket } = require("mongodb");

const { getDBReference } = require("../lib/mongo");
const { extractValidFields } = require("../lib/validation");

/*
 * Schema describing required/optional fields of a photo object.
 */
const PhotoSchema = {
  businessid: { required: true },
  caption: { required: false },
};
exports.PhotoSchema = PhotoSchema;

/*
 * Executes a DB query to insert a new photo into the database.  Returns
 * a Promise that resolves to the ID of the newly created photo entry.
 */
async function insertNewPhoto(photo) {
  return new Promise((resolve, reject) => {
    const db = getDBReference();
    const bucket = new GridFSBucket(db, { bucketName: "photos" });
    const metadata = {
      contentType: photo.contentType,
      businessid: photo.businessid,
    };
    if (photo.caption) {
      metadata.caption = photo.caption;
    }
    const uploadStream = bucket.openUploadStream(photo.filename, {
      metadata: metadata,
    });
    fs.createReadStream(photo.path)
      .pipe(uploadStream)
      .on("error", (err) => {
        reject(err);
      })
      .on("finish", (result) => {
        resolve(result._id);
      });
  });
}
exports.insertNewPhoto = insertNewPhoto;

/*
 * Executes a DB query to insert a new resized photo of an already
 * inserted photo. Returns a Promise that resolves to the ID of the
 * newly created photo entry.
 */
async function insertResizedPhoto(photoBuffer) {
  return new Promise((resolve, reject) => {
    const db = getDBReference();
    const bucket = new GridFSBucket(db, { bucketName: "photos" });
    const uploadStream = bucket.openUploadStream(
      crypto.pseudoRandomBytes(16).toString("hex")
    );
    uploadStream.write(photoBuffer);
    uploadStream.end();
  });
}
exports.insertResizedPhoto = insertResizedPhoto;

/*
 * Executes a DB query to fetch a download stream for a single photo based on
 * its ID. Returns a stream with the photo data.
 */
function getPhotoStreamById(id) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: "photos" });
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    return bucket.openDownloadStream(new ObjectId(id));
  }
}
exports.getPhotoStreamById = getPhotoStreamById;

/*
 * Executes a DB query to fetch a single specified photo based on its ID.
 * Returns a Promise that resolves to an object containing the requested
 * photo.  If no photo with the specified ID exists, the returned Promise
 * will resolve to null.
 */
async function getPhotoById(id) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: "photos" });

  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await bucket.find({ _id: new ObjectId(id) }).toArray();
    return results[0];
  }
}
exports.getPhotoById = getPhotoById;

/*
 * Executes a DB query to fetch all photos for a specified business, based
 * on the business's ID.  Returns a Promise that resolves to an array
 * containing the requested photos.  This array could be empty if the
 * specified business does not have any photos.  This function does not verify
 * that the specified business ID corresponds to a valid business.
 */
async function getPhotosByAnimalId(id) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: "photos" });

  const results = await bucket.find({ "metadata.animalId": id }).toArray();
  return results;
}
exports.getPhotosByBusinessId = getPhotosByBusinessId;
