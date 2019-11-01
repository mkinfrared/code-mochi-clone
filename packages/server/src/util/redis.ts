import Redis from "ioredis";

import { REDIS_HOST } from "@util/secrets";

const redis = new Redis({
  host: REDIS_HOST,
  port: 6379
});

export default redis;
