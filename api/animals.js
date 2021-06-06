const router = require("express").Router();
const { DataSource } = require("apollo-datasource");
const { getDbReference } = require("../lib/mongo");

class AnimalsAPI extends DataSource {
  constructor() {
    super();
    this.db = getDbReference();
  }

  async getAllAnimals() {
    const collection = this.db.collection('animals');
    const results = await collection.find({}).toArray();
    console.log(results)
		return results;
  }

  getAnimalById({ animalId }) {
    return this.data.find((animal) => animal.id === animalId);
  }

  getAnimalsByLocationId({ locationId }) {
    return this.data.filter((animal) => animal.locationId === locationId);
  }

  getAnimalsByBreed({ breed }) {
    return this.data.filter((animal) => animal.breed === breed);
  }
}
module.exports = AnimalsAPI;
