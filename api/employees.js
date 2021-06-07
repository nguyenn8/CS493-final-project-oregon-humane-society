const router = require("express").Router();
const { DataSource } = require("apollo-datasource");
const { getDbReference } = require("../lib/mongo");
const { ObjectId } = require("mongodb");
const { EmployeeSchema } = require("../models/employee");

class EmployeesAPI extends DataSource {
  constructor() {
    super();
    this.db = getDbReference();
  }

  async getAllEmployees() {
    const collection = this.db.collection("employees");
    const results = await collection.find({}).toArray();
    return results;
  }

  async getEmployeeById({ employeeId }) {
    console.log(employeeId);
    const collection = this.db.collection("employees");
    const results = await collection
      .find({ _id: ObjectId(employeeId) })
      .toArray();
    console.log(results);
    return results[0];
  }

  async addNewEmployee() {
    employee = extractValidFields(employee, EmployeeSchema);
    const collection = this.db.collection("employees");
    const result = await collection.insertOne(employee);
    return result.insertedId;
  }

  async employeeLogin() {}

  async getEmployeeServicesById({ employeeId }) {}

  async deleteEmployee() {}
}
module.exports = EmployeesAPI;
