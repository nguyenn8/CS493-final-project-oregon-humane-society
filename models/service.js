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

 	const results = collection
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
async function getServiceByName(name) {
  const db = getDBReference();
  const collection = db.collection('services');
  if (!ObjectId.isValid(name)) {
    return [];
  } else {
    const results = await collection
      .find({ name: new ObjectId(name) })
      .toArray();
    return results;
  }
}
exports.getServiceByName = getServiceByName;
/*
 * Executes a DB query to update a single specified service based on its id.
 * Returns a Promise that resolves to an object containing the updated
 * service.  If no service with the specified id exists, the returned Promise
 * will resolve to null.
 */
async function putService(id, service) {
  const db = getDbReference();
  const collection = db.collection('service');
  const results = await collection.replaceOne(
    {id: id},
    service
  );
    return{
      service: results,
    };
}
exports.putService = putService;

/*
 * Executes a DB query to delete a single specified service based on its id.
 * Returns a Promise that resolves to an object being deleted
 *   If no service with the specified id exists, the returned Promise
 * will resolve to null.
 */
async function deleteService(id) {
  const db = getDbReference();
  const collection = db.collection('services');
  const results = await collection.deleteOne({id: id});
    return{
      id: results,
    };
}
exports.deleteService = deleteService;
