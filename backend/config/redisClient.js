// config/redisClient.js
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

console.log("Redis URL:", process.env.UPSTASH_REDIS_URL);
console.log("Redis Token:", process.env.UPSTASH_REDIS_TOKEN?.slice(0, 10)); // partial for safety


export default redis;
