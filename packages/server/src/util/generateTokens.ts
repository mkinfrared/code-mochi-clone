import jwt from "jsonwebtoken";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./secrets";

const generateTokens = async (value: Value): Promise<[string, string]> => {
  const accessToken = jwt.sign(value, ACCESS_TOKEN_KEY, { expiresIn: "1m" });
  const refreshToken = jwt.sign(value, REFRESH_TOKEN_KEY, { expiresIn: "7d" });

  return [accessToken, refreshToken];
};

interface Value {
  userID: string;
}

export default generateTokens;
