import http from "http";

import { ApolloServer } from "apollo-server-express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express from "express";

import validateTokens from "@middleware/validateTokens";
import { RequestWithUser, ServerContext } from "@type/Server.type";
import { schema } from "@util/schema";
import { Photon } from "@generated/photon";
import { SERVER_PORT } from "@util/secrets";

const startServer = async () => {
  const photon = new Photon();
  const apolloServer = new ApolloServer({
    schema,
    context: (context): ServerContext => ({
      request: context.req,
      response: context.res,
      photon
    })
  });

  const app = express();

  const corsOptions: CorsOptions = {
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:4000"]
  };

  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(validateTokens);

  app.get("/me", async (req: RequestWithUser, res) => {
    if (!req.userID) return res.status(403).send("no tokens");
    const user = await photon.users.findOne({ where: { id: req.userID } });

    if (!user) return res.status(403).send("no user found");
    return res.status(200).send({ id: user.id, name: user.name });
  });

  const httpServer = http.createServer(app);
  apolloServer.applyMiddleware({ app, cors: corsOptions });
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(SERVER_PORT, () => {
    console.log(`🚀 Server ready at: http://localhost:${SERVER_PORT} 🌟`);
  });

  return httpServer;
};

export default startServer;
