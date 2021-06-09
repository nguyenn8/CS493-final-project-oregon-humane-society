/*
 * Employee schema and associated methods.
 */

const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");

const { extractValidFields } = require("../lib/validation");
const { getDbReference } = require("../lib/mongo");

/*
 * Schema for an employee.
 */

const EmployeeSchema = {
  username: { required: true },
  password: { required: true },
  date_hired: { required: true },
};
exports.EmployeeSchema = EmployeeSchema;

async function getEmployeesPage(page) {
  const db = getDbReference();
  const collection = db.collection("employees");

  const count = await collection.countDocuments();
  const pageSize = 10;
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;

  const results = await collection
    .find({})
    .sort({ _id: 1 })
    .skip(offset)
    .limit(pageSize)
    .toArray();

  return {
    employees: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count,
  };
}
exports.getEmployeesPage = getEmployeesPage;

/*
 * Insert a new employee into the DB.
 */
exports.insertNewEmployee = async function (employee) {
  const db = getDbReference();
  const collection = db.collection("employees");
  const employeeToInsert = extractValidFields(employee, EmployeeSchema);
  employeeToInsert.admin = 0;
  employeeToInsert.password = await bcrypt.hash(employeeToInsert.password, 8);
  const result = await collection.insertOne(employeeToInsert);
  console.log(result);
  return result.insertedId;
};

/*
 * Validate that the provided password matches the stored password for the
 * given username.
 */
exports.validateEmployee = async function (username, password) {
  const db = getDbReference();
  const collection = db.collection("employees");
  const employee = await getEmployeeByUsername(username);
  return employee && (await bcrypt.compare(password, employee.password));
};

/*
 * Fetch an employee from the DB based on employee username.
 */
async function getEmployeeByUsername(username) {
  const db = getDbReference();
  const collection = db.collection("employees");
  const results = await collection.find({ username: username }).toArray();
  return results[0];
}
exports.getEmployeeByUsername = getEmployeeByUsername;

/*
 * Fetch an employee from the DB based on employee ID.
 */
async function getEmployeeById(id) {
  const db = getDbReference();
  const collection = db.collection("employees");
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection.find({ _id: new ObjectId(id) }).toArray();
    return results[0];
  }
}
exports.getEmployeeById = getEmployeeById;

/*
 * Retrieve all employees from database.
 */
exports.getAllEmployees = async function () {
  const db = getDbReference();
  const collection = db.collection("employees");
  const results = await collection.find({}).toArray();
  return results;
};

/*
 * Get services that an employee performs.
 */
exports.getEmployeeServicesById = async function (employeeId) {
  const db = getDbReference();
  const collection = db.collection("services");
  const results = await collection
    .find({ employeeId: new ObjectId(employeeId) })
    .toArray();
  console.log(results);
  return results;
};

/*
 * Delete an employee in the DB by ID.
 */
exports.deleteEmployee = async function (id) {
  const db = getDbReference();
  const collection = db.collection("employees");
  if (!ObjectId.isValid(id)) {
    return null;
  }
  const exists = await collection
    .find({ _id: new ObjectId(id) })
    .limit(1)
    .count(true);
  if (!exists) {
    return null;
  }
  await collection.deleteOne({ _id: new ObjectId(id) });
  return {};
};
