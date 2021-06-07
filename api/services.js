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
    const collection = this.db.collection("services");
    const results = await collection.find({}).toArray();
    return results;
  }

  async getServiceByName({ serviceName }) {
    const collection = this.db.collection("services");
    const results = await collection.find({ name: serviceName }).toArray();
    return results;
  }

  async addNewService({}) {
    const collection = this.db.collection("services");
  }

  async updateService({ serviceId }) {
    const collection = this.db.collection("services");
  }

  async deleteService({ serviceId }) {
    const collection = this.db.collection("services");
  }
}
module.exports = ServicesAPI;
