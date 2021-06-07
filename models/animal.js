/*
 * Animal schema and associated methods.
 */

const { extractValidFields } = require("../lib/validation");
const { getDbReference } = require("../lib/mongo");
const { ObjectId } = require("mongodb");

const AnimalSchema = {
  name: { required: true },
  desc: { required: true },
  date_available: { required: true },
  weight: { required: true },
  age: { required: false },
  breed: { required: false },
  sex: { required: true },
  location: { required: true },
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
	
	const results = await collection
		.find({})
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
 * Fetch animal from DB by ID.
 */
exports.getAnimalById = async function (id) {
	const db = getDbReference();
	const collection = db.collection("animals");
	if (!ObjectId.isValid(id)) {
		return null;
	}
	const results = await collection
		.find({ _id: new ObjectId(id) })
		.limit(1)
		.toArray();
	return results[0];
}

/*
 * Fetch animal from DB by breed.
 */
exports.getAnimalByBreed = async function (breed) {
	const db = getDbReference();
	const collection = db.collection("animals");
	const results = await collection
		.find({ breed: breed })
		.toArray();
	return results;
}

/*
 * Fetch animal from DB by location.
 */
exports.getAnimalByLocation = async function (location) {
	const db = getDbReference();
	const collection = db.collection("animals");
	const results = await collection
		.find({ location: location })
		.toArray();
	return results;
}

/*
 * Insert a new animal into the DB.
 */
exports.insertNewAnimal = async function (animal) {
  animal = extractValidFields(animal, AnimalSchema);
  const db = getDbReference();
  const collection = db.collection("animals");
  const result = await collection.insertOne(animal);
  return result.insertedId;
}

/*
 * Update an animal in the DB by ID.
 */
exports.updateAnimal = async function (id, animal) {
	animal = extractValidFields(animal, AnimalSchema);
	const db = getDbReference();
	const collection = db.collection("animals");
	if (!ObjectId.isValid(id)) {
		return null;
	}
	const exists = await collection.find({ _id: new ObjectId(id) }).limit(1).count(true);
	if (!exists) {
		return null;
	}
	await collection.replaceOne({ _id: new ObjectId(id) }, animal );
	return {};
}

/*
 * Delete an animal in the DB by ID.
 */
exports.deleteAnimalById = async function (id) {
	const db = getDbReference();
	const collection = db.collection("animals");
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
