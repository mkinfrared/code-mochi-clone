import { NextFunction, Request, Response } from "express";

import { Photon } from "@generated/photon";

export interface Error {
  [key: string]: string[];
}

export interface ServerContext {
  photon: Photon;
  request: RequestWithUser;
  response: Response;
}

export interface RequestWithUser extends Request {
  userID?: string;
}

export type ExpressMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => any;
