/*
 * Employee schema and associated methods.
 */

const bcrypt = require("bcryptjs");

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
  const collection = db.collection('employees');

  const count = await collection.countDocuments();
  const pageSize = 10;
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;

  const results = await collection.find({})
    .sort({ _id: 1 })
    .skip(offset)
    .limit(pageSize)
    .toArray();

  return {
    employees: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count
  };
}
exports.getEmployeesPage = getEmployeesPage;

/*
 * Insert a new employee into the DB.
 */
exports.insertNewEmployee = async function (user) {
	const db = getDbReference();
	const collection = db.collection("employees");
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
 async function getEmployeeById(id){
   const db = getDbReference();
   const collection = db.collection('employees');
   if (!ObjectId.isValid(id)) {
     return null;
   } else {
     const results = await collection
       .find({ _id: new ObjectId(id) })
       .toArray();
     return results[0];
   }
 }
 exports.getEmployeeById = getEmployeeById;

// async function getEmployeeById(id, includePassword) {
//   const db = getDbReference();
// 	const collection = db.collection("employees");
// 	let results;
//   if (includePassword) {
//     [results] = await mysqlPool.query("SELECT * FROM users WHERE id = ?", id);
//   } else {
//     results = await mysqlPool.query(
//       "SELECT name, email, admin FROM users WHERE id = ?",
//       id
//     );
//   }
//   return results[0];
// }

//exports.getUserById = getUserById;

exports.validateEmployee = async function (id, password) {
	const db = getDbReference();
	const collection = db.collection("employees");
  console.log(id, password);
  const employee = await getUserById(id, true);
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

exports.addNewEmployee = async function () {
  const db = getDbReference();
  const collection = db.collection("employees");
  employee = extractValidFields(employee, EmployeeSchema);
  const result = await collection.insertOne(employee);
  return result.insertedId;
};

exports.getEmployeeServicesById = async function (employeeId) {};

exports.deleteEmployee = async function () {};
