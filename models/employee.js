/*
 * Employee schema and associated methods.
 */

const  { extractValidFields } = require('../lib/validation')

const EmployeeSchema = {
  id: { required: true },
  username: { required: true },
  password: { required: true },
  date_hired: { required: true }
};
exports.EmployeeSchema = EmployeeSchema;
