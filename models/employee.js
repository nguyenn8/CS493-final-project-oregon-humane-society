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
  //id: { required: true },
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
  console.log("  -- employeeToInsert before hashing:", employeeToInsert);
  employeeToInsert.password = await bcrypt.hash(employeeToInsert.password, 8);
  console.log("  -- employeeToInsert after hashing:", employeeToInsert);
  const result = await collection.insertOne(employee);
  return result.insertId;
};

/*
 * Fetch an employee from the DB based on employee ID.
 */

exports.getEmployeeById = async function (id) {
  const db = getDbReference();
  const collection = db.collection("employees");
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection.find({ _id: new ObjectId(id) }).toArray();
    return results[0];
  }
};

exports.validateEmployee = async function (id, password) {
  const db = getDbReference();
  const collection = db.collection("employees");
  console.log(id, password);
  const employee = await getEmployeeById(id);
  console.log(employee);
  return user && (await bcrypt.compare(password, employee.password));
};

exports.getAllEmployees = async function () {
  const db = getDbReference();
  const collection = db.collection("employees");
  const results = await collection.find({}).toArray();
  return results;
};

exports.getEmployeeById = async function (employeeId) {
  const db = getDbReference();
  const collection = db.collection("employees");
  const results = await collection
    .find({ _id: ObjectId(employeeId) })
    .toArray();
  console.log(results);
  return results[0];
};

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
