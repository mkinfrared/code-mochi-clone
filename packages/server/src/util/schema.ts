import path from "path";

import { nexusPrismaPlugin } from "nexus-prisma";
import { makeSchema } from "nexus";

import * as types from "../type";

export const schema = makeSchema({
  types,
  plugins: [
    nexusPrismaPlugin({
      inputs: {
        photon: path.join(__dirname, "../generated/photon")
      }
    })
  ],
  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname, "../generated/photon"),
        alias: "photon"
      },
      {
        source: require.resolve("./context"),
        alias: "Context"
      }
    ],
    contextType: "Context.Context"
  }
});
