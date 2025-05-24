const express = require("express");
const { ApolloServer } = require("@apollo/server");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { expressMiddleware } = require("@as-integrations/express5");
const http = require("http");
const cors = require("cors");
const typeDefs = require("./schemas");
const resolvers = require("./resolvers");
const { sequelize } = require("./models");

async function startServer() {
  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: false,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  const port = 4000;

  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  app.listen({ port }, () => {
    console.log(`Server ready at http://localhost:${port}`);
  });

  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connected...");
    })
    .catch((err) => {
      console.log("Error: " + err);
    });
}

startServer();
