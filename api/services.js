const router = require("express").Router();
const { DataSource } = require("apollo-datasource");
class ServicesAPI extends DataSource {
  constructor({ data }) {
    super();
    this.data = data;
  }

  getAllServices() {
    return this.data || [];
  }

  getServiceByName({ serviceName }) {
    return this.data.filter((service) => service.name === serviceName);
  }
}
module.exports = ServicesAPI;
