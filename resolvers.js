module.exports = {
	Query: {
		animals: (_, __, { dataSources }) => dataSources.animalsAPI.getAllAnimals(),
		animal: (_, { id }, { dataSources }) => dataSources.animalsAPI.getAnimalById({ animalId: id })
	}
}
