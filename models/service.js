/*
 * Service schema and associated methods.
 */
 const { ObjectId } = require('mongodb');
 const { getDBReference } = require('../lib/mongo');
const  { extractValidFields } = require('../lib/validation')

const ServiceSchema = {
  id: { required: true },
  name: { required: true },
  desc: { required: true },
  fee: { required: true },
  location_id: { required: true }
};
exports.ServiceSchema = ServiceSchema;

/*
 * Executes a DB query to insert a new service into the database.  Returns
 * a Promise that resolves to the ID of the newly-created service entry.
 */
async function insertNewService(photo) {
  location.locationid = ObjectId(location.locationid);
  const db = getDBReference();
  const collection = db.collection('services');
  const result = await collection.insertOne(service);
  return result.insertedId;
}
exports.insertNewService = insertNewService;

/*
 * Executes a DB query to fetch a single specified service based on its ID.
 * Returns a Promise that resolves to an object containing the requested
 * service.  If no service with the specified ID exists, the returned Promise
 * will resolve to null.
 */
async function getServiceById(id) {
  const db = getDBReference();
  const collection = db.collection('services');
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({ _id: new ObjectId(id) })
      .toArray();
    return results[0];
  }
}
exports.getServiceById = getServiceById;

/*
 * Executes a DB query to fetch all services for a specified business, based
 * on the business's ID.  Returns a Promise that resolves to an array
 * containing the requested services.  This array could be empty if the
 * specified business does not have any services.  This function does not verify
 * that the specified location ID corresponds to a valid location.
 */
async function getServiceByLocationId(id) {
  const db = getDBReference();
  const collection = db.collection('services');
  if (!ObjectId.isValid(id)) {
    return [];
  } else {
    const results = await collection
      .find({ locationid: new ObjectId(id) })
      .toArray();
    return results;
  }
}
exports.getLocationByBusinessId = getLocationByBusinessId;
