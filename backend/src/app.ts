import 'reflect-metadata';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import { createSchema } from './graphql/schema';
import config from './config/config';

async function main() {
  const app = express();
  const httpServer = http.createServer(app);

  const schema = await createSchema();

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  httpServer.listen(config.port, () => {
    console.log(`🚀 Server ready at http://localhost:${config.port}`);
  });
}

main().catch((error) => {
  console.error('Server failed to start', error);
});
