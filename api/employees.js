const router = require("express").Router();
const { DataSource } = require("apollo-datasource");
const { getDbReference } = require("../lib/mongo");

class EmployeesAPI extends DataSource {
  constructor() {
    super();
    this.db = getDbReference();
  }

  async getAllEmployees() {
    const collection = this.db.collection('employees');
    const results = await collection.find({}).toArray();
    return results;
  }

  getEmployeeById({ employeeId }) {
    return this.data.find((employee) => employee.id === employeeId);
  }

  getEmployeeServicesById({ employeeId }) {}
}
module.exports = EmployeesAPI;
