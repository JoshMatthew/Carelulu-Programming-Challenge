import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import { expressMiddleware } from '@as-integrations/express5';

import config from './config/config';

import typeDefs from './schemas'
import resolvers from './resolvers'

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
  );

  await new Promise<void>((resolve) => httpServer.listen(config.port, resolve));
  console.log(`Server ready at http://localhost:${config.port}`);
}

startServer();
