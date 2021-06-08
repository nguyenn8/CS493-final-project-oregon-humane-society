const redis = require("redis");
const { isAuthenticated } = require("./auth")

const redisClient = redis.createClient(
  process.env.REDIS_PORT || '6379',
  process.env.REDIS_HOST || 'localhost'
);

const rateLimitWindowMS = 60000;
const rateLimitNoAuthMaxRequests = 5;
const rateLimitAuthMaxRequests = 10;

function getUserTokenBucket(ip) {
  return new Promise((resolve, reject) => {
    redisClient.hgetall(ip, (err, tokenBucket) => {
      if (err) {
        reject(err);
      } else if (tokenBucket) {
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

    const currentTimestamp = Date.now();
    const ellapsedTime = currentTimestamp - tokenBucket.last;
    
		if (isAuthenticated(req)) {
			tokenBucket.tokens += ellapsedTime *
      	(rateLimitAuthMaxRequests / rateLimitWindowMS);
    	tokenBucket.tokens = Math.min(
      	tokenBucket.tokens,
      	rateLimitAuthMaxRequests
    	);
    	tokenBucket.last = currentTimestamp;
		} else {
			tokenBucket.tokens += ellapsedTime *
      	(rateLimitNoAuthMaxRequests / rateLimitWindowMS);
    	tokenBucket.tokens = Math.min(
      	tokenBucket.tokens,
      	rateLimitNoAuthMaxRequests
    	);
    	tokenBucket.last = currentTimestamp;
		}

    if (tokenBucket.tokens >= 1) {
      tokenBucket.tokens -= 1;
      await saveUserTokenBucket(req.ip, tokenBucket);
      next();
    } else {
      res.status(429).send({
        error: "Too many request per minute.  Please wait a bit..."
      });
    }
  } catch (err) {
    next();
  }
}
exports.rateLimit = rateLimit;
