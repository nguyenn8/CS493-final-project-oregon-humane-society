/*
 * Service schema and associated methods.
 */
 const { ObjectId } = require('mongodb');
 const { getDbReference } = require('../lib/mongo');
const  { extractValidFields } = require('../lib/validation')

const ServiceSchema = {
  name: { required: true },
  desc: { required: true },
  fee: { required: true },
  location: { required: true }
};
exports.ServiceSchema = ServiceSchema;

/*
 * Executes a DB query to insert a new service into the database.  Returns
 * a Promise that resolves to the ID of the newly-created service entry.
 */
async function insertNewService(service) {
  service = extractValidFields(service, ServiceSchema);
	const db = getDbReference();
  const collection = db.collection('services');
  const result = await collection.insertOne(service);
  return result.insertedId;
}
exports.insertNewService = insertNewService;
/*
 * Get all services from DB
 */
 async function getServicesPage(page) {
 	const db = getDbReference();
 	const collection = db.collection("services");
 	const count = await collection.countDocuments();
 	/*
 	 * Compute last page number and make sure page is within bounds.
 	 * Compute offset into collection
 	 */
 	const pageSize = 10;
 	const lastPage = Math.ceil(count / pageSize);
 	page = page > lastPage ? lastPage : page;
 	page = page < 1 ? 1 : page;
 	const offset = (page - 1) * pageSize;

 	const results = await collection
 		.find({})
 		.sort({ _id: 1 })
 		.skip(offset)
 		.limit(pageSize)
 		.toArray();

 	return {
 		services: results,
 		page: page,
 		totalPages: lastPage,
 		pageSize: pageSize,
 		count: count
 	};
 }
 exports.getServicesPage = getServicesPage;
/*
 * Executes a DB query to fetch a single specified service based on its name.
 * Returns a Promise that resolves to an object containing the requested
 * service.  If no service with the specified name exists, the returned Promise
 * will resolve to null.
 */
async function getServiceById(id) {
  const db = getDbReference();
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
 * Executes a DB query to update a single specified service based on its id.
 * Returns a Promise that resolves to an object containing the updated
 * service.  If no service with the specified id exists, the returned Promise
 * will resolve to null.
 */
 async function updateServiceById(id, service){
   const db = getDbReference();
   const collection = db.collection('services');
   if (!ObjectId.isValid(id)) {
 		return null;
 	}
 	const exists = await collection.find({ _id: new ObjectId(id) }).limit(1).count(true);

   if (!exists) {
 		return null;
 	}
 	await collection.replaceOne({ _id: new ObjectId(id) }, service );
 	return {};

 }
exports.updateServiceById = updateServiceById;

/*
 * Executes a DB query to delete a single specified service based on its id.
 * Returns a Promise that resolves to an object being deleted
 *   If no service with the specified id exists, the returned Promise
 * will resolve to null.
 */
 async function deleteServiceById(id){
   const db = getDbReference();
   const collection = db.collection('services');
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
exports.deleteServiceById = deleteServiceById;
