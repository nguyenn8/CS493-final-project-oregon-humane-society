const router = require("express").Router();
const { DataSource } = require("apollo-datasource");
class AnimalsAPI extends DataSource {
  constructor({ data }) {
    super();
    this.data = data;
  }

  getAllAnimals() {
    return this.data || [];
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
