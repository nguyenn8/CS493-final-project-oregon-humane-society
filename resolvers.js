module.exports = {
	Query: {
		animals: (_, __, { dataSources }) => dataSources.animalsAPI.getAllAnimals(),
		employees: (_, __, { dataSources }) => dataSources.employeesAPI.getAllEmployees(),
		locations: (_, __, { dataSources }) => dataSources.locationsAPI.getAllLocations(),
		services: (_, __, { dataSources }) => dataSources.servicesAPI.getAllServices()
	}
}
