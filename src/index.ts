import 'reflect-metadata';
import 'dotenv/config';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import cors from 'cors';
import { createSchema } from './utils/createSchema';

const main = async () => {
  const app = Express();
  app.use(
    cors({
      origin: '*',
    })
  );
  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({
      req,
      res,
    }),
    introspection: true,
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: '*',
    },
  });
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`server started on http://localhost:${port}/graphql`);
  });
};

main();
