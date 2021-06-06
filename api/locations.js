const router = require("express").Router();
const { DataSource } = require("apollo-datasource");
const { getDbReference } = require("../lib/mongo");
const { ObjectId } = require("mongodb");

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

  async getLocationById({ locationId }) {
    console.log(locationId);
    const collection = this.db.collection('locations');
    const results = await collection.find({ _id: ObjectId(locationId) }).toArray();
    console.log(results);
    return results[0];
  }
}
module.exports = LocationAPI;
