/*
 * Create router object.
 */
const router = require("express").Router();

/*
 * Get required functions from API source files.
 */
const { validateAgainstSchema } = require("../lib/validation");
const {
  AnimalSchema,
  getAnimalsPage,
  getAnimalById,
  getAnimalByBreed,
  getAnimalByLocation,
  insertNewAnimal,
  updateAnimal,
  deleteAnimalById,
} = require("../models/animal");
const { requireAuthentication } = require("../lib/auth");

/*
 * Endpoint to retrieve all animals. Results are paginated.
 */
router.get("/", async (req, res) => {
  try {
    const animalPage = await getAnimalsPage(parseInt(req.query.page) || 1);
    animalPage.links = {};
    if (animalPage.page < animalPage.totalPages) {
      animalPage.links.nextPage = `/animals?page=${animalPage.page + 1}`;
      animalPage.links.lastPage = `/animals?page=${animalPage.totalPages}`;
    }
    if (animalPage.page > 1) {
      animalPage.links.prevPage = `/animals?page=${animalPage.page - 1}`;
      animalPage.links.firstPage = `/animals?page=1`;
    }
    res.status(200).send(animalPage);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Error fetching businesses list. Please try again later.",
    });
  }
});

/*
 * Endpoint to retrieve animal by ID.
 */
router.get("/:id", async (req, res, next) => {
  try {
    const animal = await getAnimalById(req.params.id);
    if (animal) {
      res.status(200).send(animal);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch animal. Please try again later.",
    });
  }
});

/*
 * Endpoint to retrieve all animals of a specfic breed.
 */
router.get("/breed/:breed", async (req, res) => {
  try {
    const animal = await getAnimalByBreed(req.params.breed);
    if (animal) {
      res.status(200).send(animal);
    } else {
      res.status(404).send({
        error: "Animal with breed " + req.params.breed + " is not available.",
      });
    }
  } catch (err) {
    res.status(500).send({
      error: "Unable to fetch animal. Please try again later.",
    });
  }
});

/*
 * Endpoint to retrieve all animals at a specific location.
 */
router.get("/location/:location", async (req, res) => {
  try {
    const animal = await getAnimalByLocation(req.params.location);
    if (animal) {
      res.status(200).send(animal);
    } else {
      res.status(404).send({
        error:
          "Animal with location " + req.params.location + " is not available.",
      });
    }
  } catch (err) {
    res.status(500).send({
      error: "Unable to fetch animal. Please try again later.",
    });
  }
});

/*
 * Endpoint to add a new animal.
 */
router.post("/", requireAuthentication, async (req, res) => {
  if (validateAgainstSchema(req.body, AnimalSchema)) {
    try {
      const id = await insertNewAnimal(req.body);
      res.status(201).send({
        id: id,
        links: {
          animal: `/animals/${id}`,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error inserting animal into DB. Please try again later.",
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid animal object.",
    });
  }
});

/*
 * Endpoint to update an existing animal.
 */
router.put("/:id", requireAuthentication, async (req, res) => {
  if (validateAgainstSchema(req.body, AnimalSchema)) {
    try {
      const success = await updateAnimal(req.params.id, req.body);
      if (success) {
        res.status(204).end();
      } else {
        res.status(404).send({
          error: "Cannot update an animal that does not exist.",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error inserting animal into DB. Please try again later.",
      });
    }
  } else {
    res.status(400).send({
      error: "Request body is not a valid animal object.",
    });
  }
});

/*
 * Endpoint to delete an existing animal.
 */
router.delete("/:id", requireAuthentication, async (req, res) => {
  try {
    const success = await deleteAnimalById(req.params.id);
    if (success) {
      res.status(204).end();
    } else {
      res.status(404).send({
        error: "Cannot delete an animal that does not exist.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to delete animal. Please try again later.",
    });
  }
});

/*
 * Export completed animal router.
 */
module.exports = router;
