import 'reflect-metadata';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import { createSchema } from './graphql/schema';
import config from './config/config';
import { context } from './lib/appContext';
import { nextTick } from 'process';

async function main() {
  const app = express();
  const httpServer = http.createServer(app);

  const schema = await createSchema();

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  const apiKeyMiddleware = (req: any, res: any, next: any) => {
    const apiKey = req?.headers['x-api-key'];

    if (!apiKey) {
      console.log('No API Key');
      return res.status(401).json({ message: 'API key missing' });
    }

    if (apiKey !== process.env.API_KEY) {
      console.log('Invalid API Key');
      return res.status(403).json({ message: 'Invalid API key' });
    }

    next();
  };

  app.use(
    '/',
    cors(),
    express.json(),
    apiKeyMiddleware,
    expressMiddleware(server, {
      context,
    }),
  );

  httpServer.listen(config.port, () => {
    console.log(`🚀 Server ready at http://localhost:${config.port}`);
  });
}

main().catch((error) => {
  console.error('Server failed to start', error);
});
