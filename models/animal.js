/*
 * Animal schema and associated methods.
 */

const { extractValidFields } = require("../lib/validation");
const { getDbReference } = require("../lib/mongo");

const AnimalSchema = {
  id: { required: true },
  name: { required: true },
  desc: { required: true },
  date_available: { required: true },
  weight: { required: true },
  age: { required: false },
  breed: { required: false },
  sex: { required: true },
  location_id: { required: true },
};
exports.AnimalSchema = AnimalSchema;

/*
 * Fetch all animals from DB.
 */
exports.getAnimalsPage = async function (page) {
	const db = getDbReference();
	const collection = db.collection("animals");
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
		animals: results,
		page: page,
		totalPages: lastPage,
		pageSize: pageSize,
		count: count
	};
}

/*
 * Insert a new animal into the DB.
 */
