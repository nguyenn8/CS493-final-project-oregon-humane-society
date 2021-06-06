const router = require("express").Router();
const { DataSource } = require("apollo-datasource");
class LocationAPI extends DataSource {
  constructor({ dbRef }) {
    super();
    this.db = dbRef;
  }

  getAllLocations() {
    return this.data;
  }

  getLocationById({ locationId }) {
    return this.data.find((location) => location.id === locationId);
  }
}
module.exports = LocationAPI;
