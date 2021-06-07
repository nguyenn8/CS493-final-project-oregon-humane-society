const router = require("express").Router();
const { validateAgainstSchema} = require("../lib/validation");
const { ObjectId } = require("mongodb");
const { insertNewService,
        ServiceSchema,
        getServiceById,
        getServicesPage,
        deleteService,
				putService
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
 * Route to fetch info about all services.
 */
 router.get("/", async (req, res) => {
 	try {
 		const servicePage = await getServicesPage(parseInt(req.query.page) || 1);
 		servicePage.links = {};
 		if (servicePage.page < servicePage.totalPages) {
 			servicePage.links.nextPage = `/services?page=${servicePage.page + 1}`;
 			servicePage.links.lastPage = `/services?page=${servicePage.totalPages}`;
 		}
 		if (servicePage.page > 1) {
 			servicePage.links.prevPage = `/services?page=${servicePage.page - 1}`;
 			servicePage.links.firstPage = `/services?page=1`;
 		}
 		res.status(200).send(servicePage);
 	} catch (err) {
 		console.error(err);
 		res.status(500).send({
 			error: "Error fetching Services list. Please try again later."
 		});
 	}
 });

/*
 * Route to fetch info about a specific service by ID.
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

/*
 * Route to update an existing service.
 */
router.put('/:id', async (req, res, next) => {
  try{
    await putService(req.params.id, req.body);
    res.status(204).end();
  }catch(err){
    console.error("--Error:", err);
    res.status(500).send({
    err: "Error updating service in DB. Try again later."
  })
 }
});

/*
 * Route to delete a service.
 */
router.delete('/:id', async (req, res, next) =>{
  try {
    const id = await deleteService(req.params.id);
    res.status(204).end();
  } catch(err){
      console.error(err);
      res.status(500).send({
        err: "Error deleting service from DB. Try again later."
      })
    }
});

module.exports = router;
