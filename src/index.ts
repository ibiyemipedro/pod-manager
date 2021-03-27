import express, { Application, Request, Response, NextFunction } from 'express';
import { config } from './config/index';
import { dbConnect } from './config/dbConfig'
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema/index');
import consola from 'consola'

const bodyparser = require('body-parser');

const app: Application = express();

app.use(bodyparser.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// playground: IN_PROD ? false : {
//   settings : {
//     "request.credentials":"include"
//   }
// } 


const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

// Default landing endpoint if ever other one fails
app.use('/', (req: Request, res: Response, next: NextFunction) => res.status(404).json({ message: 'Welcome to  Pod Manager. **winks**' }));


const startApp = async () => {
  try {
    await dbConnect();
    consola.success({ messaee: 'Successfully connected to DB ', badge: true })

    app.listen(config.PORT, () => {
      consola.success({ messaee: 'Successfully connected to DB ', badge: true })

      console.log(`🚀 Server ready at http://localhost:${config.PORT}/${server.graphqlPath}`)
    });

  } catch (error) {
    consola.error({ messaee: `Unable to start server: ${error.message}`, badge: true })

  }

}

