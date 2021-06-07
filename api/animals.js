const router = require("express").Router();
const { getDbReference } = require("../lib/mongo");
const { ObjectId } = require("mongodb");
const { AnimalSchema, 
				getAnimalsPage } = require("../models/animal");


router.get("/", async (req, res) => {
	try {
		const animalPage = await getAllAnimals(parseInt(req.query.page) || 1);
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
			error: "Error fetching businesses list. Please try again later."
		});
	}
});

router.get("/:id", async (req, res) =>  {
	return
});

router.get("/:location", async (req, res) => {
	return
});

router.get("/:breed", async (req, res) => {
	return
});

router.post("/", async (req, res) => {
	return
});

router.put("/:id", async (req, res) => {
	return
});

router.delete("/:id", async () => {
	return
});
module.exports = router;
