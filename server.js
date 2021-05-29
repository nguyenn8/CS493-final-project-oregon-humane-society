const express = require("express");
const morgan = require("morgan");
const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./schemas/schema");

const api = require("./api");

const app = express();
const port = process.env.PORT || 8000;
const server = new ApolloServer({ typeDefs });
server.applyMiddleware({ app });
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
app.use("/", api);

app.use("*", function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist",
  });
});

app.listen(port, function () {
  console.log("== Server is running on port", port);
});
