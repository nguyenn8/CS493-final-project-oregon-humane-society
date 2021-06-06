module.exports = {
	Query: {
		animals: (_, __, { dataSources }) => dataSources.animalsAPI.getAllAnimals(),
		animal: (_, { id }, { dataSources }) => dataSources.animalsAPI.getAnimalById({ animalId: id }),
		employees: (_, __, { dataSources }) => dataSources.employeesAPI.getAllEmployees(),
		locations: (_, __, { dataSources }) => dataSources.locationsAPI.getAllLocations(),
		services: (_, __, { dataSources }) => dataSources.servicesAPI.getAllServices()
	}
}
