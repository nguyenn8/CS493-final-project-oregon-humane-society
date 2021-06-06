const router = require("express").Router();
const { DataSource } = require("apollo-datasource");
const { getDbReference } = require("../lib/mongo");
const { ObjectId } = require("mongodb");

class AnimalsAPI extends DataSource {
  constructor() {
    super();
    this.db = getDbReference();
  }

  async getAllAnimals() {
    const collection = this.db.collection('animals');
    const results = await collection.find({}).toArray();
    return results;
  }

  async getAnimalById({ animalId }) {
    console.log(animalId);
    const collection = this.db.collection('animals');
    const results = await collection.find({ _id: ObjectId(animalId) }).toArray();
    console.log(results);
    return results[0];
  }

  getAnimalsByLocationId({ locationId }) {
    return this.data.filter((animal) => animal.locationId === locationId);
  }

  getAnimalsByBreed({ breed }) {
    return this.data.filter((animal) => animal.breed === breed);
  }
}
module.exports = AnimalsAPI;
