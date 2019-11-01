import { ContextParameters } from "graphql-yoga/dist/types";
import { Request, Response } from "express";

import { Photon } from "../generated/photon";

const photon = new Photon();

export interface Context {
  photon: Photon;
  request: Request;
  response: Response;
}

export const createContext = (contextParameters: ContextParameters) => {
  const { request, response } = contextParameters;
  return {
    request,
    response,
    photon
  };
};
