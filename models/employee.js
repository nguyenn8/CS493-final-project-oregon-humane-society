/*
 * Employee schema and associated methods.
 */

const mysqlPool = require("../lib/mysqlPool");
const bcrypt = require("bcryptjs");

const { extractValidFields } = require("../lib/validation");
const { getDbReference } = require("../lib/mongo");

const db = getDbReference();
const collection = db.collection("employees");

/*
 * Schema for an employee.
 */

const EmployeeSchema = {
  id: { required: true },
  username: { required: true },
  password: { required: true },
  date_hired: { required: true },
};
exports.EmployeeSchema = EmployeeSchema;

/*
 * Insert a new employee into the DB.
 */
exports.insertNewEmployee = async function (user) {
  const userToInsert = extractValidFields(user, UserSchema);
  console.log("  -- userToInsert before hashing:", userToInsert);
  userToInsert.password = await bcrypt.hash(userToInsert.password, 8);
  console.log("  -- userToInsert after hashing:", userToInsert);
  const [result] = await mysqlPool.query("INSERT INTO users SET ?", user);
  return result.insertId;
};

/*
 * Fetch an employee from the DB based on employee ID.
 */
async function getEmployeeById(id, includePassword) {
  let results;
  if (includePassword) {
    [results] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", id);
  } else {
    results = await mysqlPool.query(
      "SELECT name, email, admin FROM users WHERE id = ?",
      id
    );
  }
  return results[0];
}

exports.getUserById = getUserById;

exports.validateEmployee = async function (id, password) {
  console.log(id, password);
  const employee = await getUserById(id, true);
  console.log(employee);
  return user && (await bcrypt.compare(password, employee.password));
};

exports.getAllEmployees = async function () {
  const collection = db.collection("employees");
  const results = await collection.find({}).toArray();
  return results;
};

exports.getEmployeeById = async function (employeeId) {
  console.log(employeeId);
  const collection = this.db.collection("employees");
  const results = await collection
    .find({ _id: ObjectId(employeeId) })
    .toArray();
  console.log(results);
  return results[0];
};

exports.addNewEmployee = async function () {
  employee = extractValidFields(employee, EmployeeSchema);
  const collection = this.db.collection("employees");
  const result = await collection.insertOne(employee);
  return result.insertedId;
};

exports.getEmployeeServicesById = async function (employeeId) {};

exports.deleteEmployee = async function () {};
