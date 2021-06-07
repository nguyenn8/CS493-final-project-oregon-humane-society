const router = require("express").Router();
const { DataSource } = require("apollo-datasource");
const { getDbReference } = require("../lib/mongo");
const { ObjectId } = require("mongodb");
const { insertNewService,
        ServiceSchema,
        getServiceById
      } = require ("../models/service");

/*
 * Route to create a new service.
 */
router.post('/', async (req, res) => {
  if (validateAgainstSchema(req.body, ServiceSchema)) {
    try {
      const id = await insertNewService(req.body);
      res.status(201).send({
        id: id,
        links: {
          service: `/services/${id}`,
          location:  `/locations/${locationid}`
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error inserting service into DB.  Please try again later."
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid service object."
    });
  }
});
/*
 * Route to fetch info about a specific service.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const service = await getServiceById(req.params.id);
    if (service) {
      res.status(200).send(service);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch service.  Please try again later."
    });
  }
});
module.exports = router;
