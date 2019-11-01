import dotenv from "dotenv";

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT as string;
const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY as string;
const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY as string;
const REDIS_HOST = process.env.REDIS_HOST as string;

export { SERVER_PORT, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, REDIS_HOST };
