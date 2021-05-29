const router = require("express").Router();
const { DataSource } = require("apollo-datasource");
class EmployeesAPI extends DataSource {
  constructor({ data }) {
    super();
    this.data = data;
  }

  getAllEmployees() {
    return this.data;
  }

  getEmployeeById({ employeeId }) {
    return this.data.find((employee) => employee.id === employeeId);
  }

  getEmployeeServicesById({ employeeId }) {}
}
module.exports = EmployeesAPI;
