const router = require("express").Router();
const { DataSource } = require("apollo-datasource");
const { getDbReference } = require("../lib/mongo");

class LocationAPI extends DataSource {
  constructor() {
    super();
    this.db = getDbReference();
  }

  async getAllLocations() {
    const collection = this.db.collection('locations');
    const results = await collection.find({}).toArray();
    return results;
  }

  getLocationById({ locationId }) {
    return this.data.find((location) => location.id === locationId);
  }
}
module.exports = LocationAPI;
