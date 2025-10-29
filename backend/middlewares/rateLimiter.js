import redis from "../config/redisClient.js";

export const redisRateLimiter = (limit, windowInSeconds) => {
  return async (req, res, next) => {
    const ip = req.ip; 
    const key = `ratelimit:${ip}`;

    // Increment count
    const requests = await redis.incr(key);

    if (requests === 1) {
      // set expiry only for the first request
      await redis.expire(key, windowInSeconds);
    }

    if (requests > limit) {
        const error= new Error("Too many requests, please try again later.");
        error.statusCode=429;
        return next(error);
    }
    next();
  };
};
