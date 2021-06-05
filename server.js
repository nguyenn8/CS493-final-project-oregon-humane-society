const express = require("express");
const morgan = require("morgan");
const redis = require('redis') ; //Rate Limiting
const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./schemas/schema");

const api = require("./api");



const app = express();
const port = process.env.PORT || 8000;
const server = new ApolloServer({ typeDefs });
server.applyMiddleware({ app });

//=====Rate Limiting Start====
const redisClient = redis.createClient(
  process.env.REDIS_PORT || '6397',
  process.envREDIS_HOST || 'localhost'
);
const rateLimitWindowMS = 60000;
const rateLimitMaxRequests = 5;

function getUserTokenBucket(ip) {
  return new Promise((resolve, reject) => {
    redisClient.hgetall(ip, (error, tokenBucket) => {
      if (err){
        reject(err);
      } else if (tokenBucket){
        tokenBucket.tokens = parseFloat(tokenBucket.tokens);
        resolve(tokenBucket);
      } else {
        resolve({
          tokens: rateLimitMaxRequests,
          last: Date.now()
        });
      }
    });
  });
}

function saveUserTokenBucket(ip, tokenBucket) {
  return new Promise((resolve, reject) => {
    redisClient.hmset(ip, tokenBucket, (err, resp) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function rateLimit(req, res, next) {
  try {
    const tokenBucket = await getUserTokenBucket(req.ip);
    const currentTime = Date.now();
    const ellapsedTime = currentTime - tokenBucket.last;
    tokenBucket.tokens += ellapsedTime *
      (rateLimitMaxRequests / rateLimitWindowMS);
    tokenBucket.tokens = Math.min(tokenBucket.tokens,
        rateLimitMaxRequests);
    tokenBucket.last = currentTime;

    if (tokenBucket.token >= 1) {
      tokenBucket.tokens -= 1;
      await saveUserTokenBucket(req.id, tokenBucket);
      next();
    } else {
      res.status(429).send({
        error: "Too many requests per minute. Please wait a minute."
      });
    }
  } catch (err) {
    next();
  }
}

app.use(rateLimit);
//=====Rate Limiting End====
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
