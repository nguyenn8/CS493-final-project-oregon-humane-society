const router = require("express").Router();
const { getDbReference } = require("../lib/mongo");
const { ObjectId } = require("mongodb");
const { validateUser } = require("../lib/validation");
const { requireAuthentication } = require("../lib/auth");
const { validateAgainstSchema } = require("../lib/validation");

const {
  LocationSchema,
  getLocationsPage,
  insertNewLocation,
  replaceLocationById,
  deleteLocationById,
  getLocationById,
} = require("../models/location");

/*
 * Route to get information about all locations.
 */
router.get("/", async (req, res) => {
  try {
    const locationsPage = await getLocationsPage(parseInt(req.query.page) || 1);
    res.status(200).send(locationsPage);
  } catch (err) {
    console.error("  -- error:", err);
    res.status(500).send({
      err: "Error fetching locations page from DB.  Try again later.",
    });
  }
});

/*
 * Route to create a new location if administrator
 */
router.post("/", requireAuthentication, async (req, res, next) => {
  if (validateAgainstSchema(req.body, LocationSchema)) {
    try {
      const id = await insertNewLocation(req.body);
      res.status(201).send({
        _id: id,
      });
    } catch (err) {
      console.error("  -- Error:", err);
      res.status(500).send({
        error: "Error inserting new location.  Try again later.",
      });
    }
  } else {
    res.status(400).send({
      error: "Request body does not contain a valid User.",
    });
  }
});

/*
 * Route to fetch info about a specific location including adoptable animals in this location
 */
router.get("/:id", async (req, res, next) => {
  try {
    const location = await getLocationById(req.params.id);
    if (location) {
      res.status(200).send(location);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch location.  Please try again later.",
    });
  }
});

/*
 * Route to update a location.
 * Update information about a specific location if administrator
 */
router.put("/:id", requireAuthentication, async (req, res, next) => {
  const location = await getLocationById(req.params.id);
  if (parseInt(req.params.id) !== parseInt(location._id)) {
    res.status(403).send({
      error: "Unauthorized to access the specified resource",
    });
  } else {
    if (validateAgainstSchema(req.body, LocationSchema)) {
      try {
        const updateSuccessful = await replaceLocationById(
          req.params.id,
          req.body
        );
        if (updateSuccessful) {
          res.status(200).send({
            links: {
              location: `/photos/${parseInt(location._id)}`,
            },
          });
        } else {
          next();
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Unable to update photo.  Please try again later.",
        });
      }
    } else {
      res.status(400).send({
        error: "Request body is not a valid location object.",
      });
    }
  }
});

/*
 * Route to delete a location.
 * Delete a location from the shelter database
 */
router.delete("/:id", requireAuthentication, async (req, res, next) => {
  const location = await getLocationById(req.params.id);
  if (parseInt(req.params.id) !== parseInt(location._id)) {
    res.status(403).send({
      error: "Unauthorized to access the specified resource",
    });
  } else {
    try {
      const deleteSuccessful = await deleteLocationById(req.params.id);
      if (deleteSuccessful) {
        res.status(204).end();
      } else {
        next();
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Unable to delete location.  Please try again later.",
      });
    }
  }
});

module.exports = router;
