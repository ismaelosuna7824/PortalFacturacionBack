// Añadir los imports
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import schema from './schema';
import { ApolloServer, PubSub } from 'apollo-server-express';
import { createServer } from 'http';
import expressPlayGround from 'graphql-playground-middleware-express';
import connection from './config/database';
async function init() {
  // Inicializamos la aplicación express
  const app = express();

  // Añadimos configuración de Cors y compression
  app.use('*', cors());
  const pubsub = new PubSub();
  app.use(compression());

  // Inicializamos el servidor de Apollo
  const server = new ApolloServer({
    schema,
    introspection: true, // Necesario
    context: async ({req}:any) => {
     // console.log(req.headers.authorization)
      const token = req ? req.headers.authorization : connection;
      return { connection, pubsub, token };
    },
  });

  server.applyMiddleware({ app });

  app.use(
    '/',
    expressPlayGround({
      endpoint: '/graphql',
    })
  );

  const PORT = process.env.PORT || 5004;

  const httpServer = createServer(app);
  server.installSubscriptionHandlers(httpServer);

  httpServer.listen({ port: PORT }, 
    (): void =>
    {
      console.log(`http://localhost:${PORT}/graphql`)
      console.log(`ws://localhost:${PORT}${server.subscriptionsPath}`);
    }
  );
}

init();