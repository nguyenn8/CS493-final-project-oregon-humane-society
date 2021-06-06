module.exports = {
	Query: {
		animals: (_, __, { dataSources }) => dataSources.animalsAPI.getAllAnimals(),
		animal: (_, { id }, { dataSources }) => dataSources.animalsAPI.getAnimalById({ animalId: id }),

		employees: (_, __, { dataSources }) => dataSources.employeesAPI.getAllEmployees(),
		employee: (_, { id }, { dataSources }) => dataSources.employeesAPI.getEmployeeById({ employeeId: id }),

		locations: (_, __, { dataSources }) => dataSources.locationsAPI.getAllLocations(),
		location: (_, { id }, { dataSources }) => dataSources.locationsAPI.getLocationById({ locationId: id }),
		
		services: (_, __, { dataSources }) => dataSources.servicesAPI.getAllServices()
	}
}
