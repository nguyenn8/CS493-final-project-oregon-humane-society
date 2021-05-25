/*
 * Location schema and associated methods.
 */

const  { extractValidFields } = require('../lib/validation')

LocationSchema = {
      id: { required: true },
      name: { required: true },
      desc: { required: true },
      population: { required: true },
      capacity: { required: true }
};
exports.LocationSchema = LocationSchema;
