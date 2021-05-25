/*
 * Animal schema and associated methods.
 */

const  { extractValidFields } = require('../lib/validation')

const AnimalSchema = {
  id: { required: true },
  name: { required: true },
  desc: { required: true },
  date_available: { required: true },
  weight: { required: true },
  age: { required: false },
  breed: { required: false },
  sex: { required: true },
  location_id: { required: true },
};
exports.AnimalSchema = AnimalSchema;
