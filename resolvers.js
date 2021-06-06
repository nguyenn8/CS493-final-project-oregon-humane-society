module.exports = {
	Query: {
		animals: (_, __, { dataSources }) => dataSources.animalsAPI.getAllAnimals()
	}
}
