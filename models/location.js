/*
 * Location schema and associated methods.
 */

const  { extractValidFields } = require('../lib/validation')
const bcrypt = require("bcryptjs");
const { getDbReference } = require("../lib/mongo");
const { ObjectId } = require('mongodb');

LocationSchema = {
      //id: { required: true },
      name: { required: true },
      desc: { required: true },
      population: { required: true },
      capacity: { required: true }
};
exports.LocationSchema = LocationSchema

/*
 * Get a page of locations.
 */
async function getLocationsPage(page) {
  const db = getDbReference();
  const collection = db.collection('locations');

  const count = await collection.countDocuments();
  const pageSize = 10;
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;

  const results = await collection.find({})
    .sort({ _id: 1 })
    .skip(offset)
    .limit(pageSize)
    .toArray();

  return {
    locations: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count
  };
}
exports.getLocationsPage = getLocationsPage;

/*
 * Create a new location.
 */
async function insertNewLocation(location) {
  location = extractValidFields(location, LocationSchema);
  const db = getDbReference();
  const collection = db.collection('locations');
  const result = await collection.insertOne(location);
  console.log("  -- result:", result);
  return result.insertedId;
}
exports.insertNewLocation = insertNewLocation;

/*
 * Get a location by ID.
 */
async function getLocationById(id){
  const db = getDbReference();
  const collection = db.collection('locations');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .toArray();
    return results[0];
  }
}
exports.getLocationById = getLocationById;

/*
 * Update a location by ID.
 */
async function replaceLocationById(id, location){
  const db = getDbReference();
  const collection = db.collection('locations');
  if (!ObjectId.isValid(id)) {
		return null;
	}
	const exists = await collection.find({ _id: new ObjectId(id) }).limit(1).count(true);

  if (!exists) {
		return null;
	}
	await collection.replaceOne({ _id: new ObjectId(id) }, location );
	return {};

}
exports.replaceLocationById = replaceLocationById;

/*
 * Delete a location by ID.
 */
async function deleteLocationById(id){
  const db = getDbReference();
  const collection = db.collection('locations');
  if (!ObjectId.isValid(id)) {
		return null;
	}
	const exists = await collection.find({ _id: new ObjectId(id) }).limit(1).count(true);
	if (!exists) {
		return null;
	}
	await collection.deleteOne({ _id: new ObjectId(id) })
	return {};
}
exports.deleteLocationById = deleteLocationById;
