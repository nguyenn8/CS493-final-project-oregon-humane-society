/*
 * Service schema and associated methods.
 */

const  { extractValidFields } = require('../lib/validation')

const ServiceSchema = {
  id: { required: true },
  name: { required: true },
  desc: { required: true },
  fee: { required: true },
  location_id: { required: true }
};
exports.ServiceSchema = ServiceSchema;
