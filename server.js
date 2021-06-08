const express = require("express");
const morgan = require("morgan");


const { connectToDb, getDbReference } = require("./lib/mongo");
const { rateLimit } = require("./lib/redis")
const api = require("./api");

const app = express();
const port = process.env.PORT || 8000;

/*
 * Morgan is a popular logger.
 */
app.use(morgan("dev"));

app.use(express.json());
app.use(express.static("public"));


/*
 * Allow rate limiting to intercept all requests before proceeding to endpoints.
 */
app.use(rateLimit);


/*
 * All routes for the API are written in modules in the api/ directory.  The
 * top-level router lives in api/index.js.
 */
app.use("/", api);

app.use("*", function (req, res, next) {
  	res.status(404).json({
    	error: "Requested resource " + req.originalUrl + " does not exist",
	  });
	});

/*
 *
 */
connectToDb(async () => {
  app.listen(port, function () {
    console.log("== Server is running on port", port);
  });
});
