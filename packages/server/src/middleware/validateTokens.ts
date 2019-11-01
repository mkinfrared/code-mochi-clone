import jwt from "jsonwebtoken";

import redis from "@util/redis";
import generateTokens from "@util/generateTokens";
import { ExpressMiddleware } from "@type/Server.type";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@util/secrets";

const validateTokens: ExpressMiddleware = async (req, res, next) => {
  const accessToken = req.cookies["accessToken"];
  const refreshToken = req.cookies["refreshToken"];

  let data: any;

  if (!accessToken && !refreshToken) {
    return next();
  }

  // Verify access token. If valid proceeds to next middleware. Otherwise throws an error
  // in order to validate the refresh token

  try {
    data = jwt.verify(accessToken, ACCESS_TOKEN_KEY) as any;
    req.userID = data.userID;

    return next();
  } catch {
    console.warn("Access token is outdated");
  }

  try {
    data = jwt.verify(refreshToken, REFRESH_TOKEN_KEY);
    const token = await redis.get(refreshToken);

    if (token) {
      console.log("STOLEN");
      throw new Error();
    } else {
      await redis.set(refreshToken, true, "EX", 60 * 60 * 24 * 7);
    }
  } catch {
    return next();
  }

  const [newAccessToken, newRefreshToken] = await generateTokens({
    userID: data.userID
  });

  res.cookie("accessToken", newAccessToken, { httpOnly: true });
  res.cookie("refreshToken", newRefreshToken, { httpOnly: true });

  req.userID = data.userID;

  return next();
};

export default validateTokens;
