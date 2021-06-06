const express = require("express");
const morgan = require("morgan");
const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./schemas/schema");
const AnimalsAPI = require("./api/animals");
const EmployeesAPI = require("./api/employees");
const LocationsAPI = require("./api/locations");
const ServicesAPI = require("./api/services");
const resolvers = require("./resolvers")


const { connectToDb, getDbReference } = require('./lib/mongo');
//const api = require("./api");

const app = express();
const port = process.env.PORT || 8000;

/*
 * Morgan is a popular logger.
 */
app.use(morgan("dev"));

app.use(express.json());
app.use(express.static("public"));

/*
 * All routes for the API are written in modules in the api/ directory.  The
 * top-level router lives in api/index.js.
 */
//app.use("/", api);


/*
 *
 */
connectToDb(async () => {
	const db = getDbReference();
	const server = new ApolloServer({ 
  	typeDefs,
		resolvers,
		dataSources: () => ({
			animalsAPI: new AnimalsAPI(),
			employeesAPI: new EmployeesAPI({ db }),
			locationsAPI: new LocationsAPI({ db }),
			servicesAPI: new ServicesAPI({ db })
		})
	});
	server.applyMiddleware({ app });

	app.use("*", function (req, res, next) {
  	res.status(404).json({
    	error: "Requested resource " + req.originalUrl + " does not exist",
	  });
	});

  app.listen(port, function () {
    console.log("== Server is running on port", port);
  });
});
