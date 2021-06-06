const router = require("express").Router();
const { DataSource } = require("apollo-datasource");
class ServicesAPI extends DataSource {
  constructor({ dbRef }) {
    super();
    this.db = dbRef;
  }

  getAllServices() {
    return this.data || [];
  }

  getServiceByName({ serviceName }) {
    return this.data.filter((service) => service.name === serviceName);
  }
}
module.exports = ServicesAPI;
