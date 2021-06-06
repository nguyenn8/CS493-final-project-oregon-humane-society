const router = require("express").Router();
const { DataSource } = require("apollo-datasource");
const { getDbReference } = require("../lib/mongo");
const { ObjectId } = require("mongodb");

class ServicesAPI extends DataSource {
  constructor() {
    super();
    this.db = getDbReference();
  }

  async getAllServices() {
    const collection = this.db.collection('services');
    const results = await collection.find({}).toArray();
    return results;
  }

  getServiceByName({ serviceName }) {
    return this.data.filter((service) => service.name === serviceName);
  }
}
module.exports = ServicesAPI;
