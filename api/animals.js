const router = require("express").Router();
const { DataSource } = require("apollo-datasource");
const { getDbReference } = require("../lib/mongo");
const { ObjectId } = require("mongodb");
const { AnimalSchema } = require("../models/animal");

class AnimalsAPI extends DataSource {
  constructor() {


  }

  async getAllAnimals() {
    const collection = this.db.collection("animals");
    const results = await collection.find({}).toArray();
    return results;
  }

  async getAnimalById({ animalId }) {
    console.log(animalId);
    const collection = this.db.collection("animals");
    const results = await collection
       .find({ _id: ObjectId(animalId) })
       .toArray();
    console.log(results);
    return results[0];
  }

  async getAnimalsByLocationId({ locationId }) {
     console.log(locationId);
     const collection = this.db.collection("animals");
     const results = await collection
       .find({ locationId: ObjectId(locationId) })
       .toArray();
     console.log(results);
     return results[0];
   }

   async getAnimalsByBreed({ breed }) {
     console.log(breed);
     const collection = this.db.collection("animals");
     const results = await collection.find({ breed: breed }).toArray();
     console.log(results);
     return results[0];
   }

   async addNewAnimal({ animal }) {
     animal = extractValidFields(animal, AnimalSchema);
     const collection = this.db.collection("animals");
     const result = await collection.insertOne(animal);
     return result.insertedId;
 }

  async updateAnimalInfo({}) {
    const collection = this.db.collection("animals");
 }


  getAnimalsByBreed({ breed }) {
    return this.data.filter((animal) => animal.breed === breed);
  }

  async deleteAnimalInfo({}) {
   const collection = this.db.collection("animals");
 }
}
module.exports = AnimalsAPI;
