import {resolvers} from './graphql/graphql.resolvers';
import {authChecker} from './graphql/authChecker';
import {
  // ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginDrainHttpServer,
  // ApolloServerPluginLandingPageProductionDefault,
  // ApolloServerPluginLandingPageLocalDefault,
} from 'apollo-server-core';
// import {ApolloServerPluginUsageReporting} from '@apollo/server/plugin/usageReporting';
import {ApolloServer} from 'apollo-server-express';
import {WebSocketServer} from 'ws';
import {useServer} from 'graphql-ws/lib/use/ws';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import 'reflect-metadata';
import {Container} from 'typedi';
import {buildSchema} from 'type-graphql';
import Startdb from './config/startup/db';
import 'express-async-errors';
import http from 'http';
import {buildContext} from 'graphql-passport';
import session from 'express-session';
import MdStore from 'connect-mongodb-session';
import passport from './config/passport-strategies';
import {dbString} from './config/startup/database';
import {Context} from 'graphql-ws';
import {GraphQLError} from 'graphql';
import {ApolloServerErrorCode} from './config/types/apollo.types';
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core/dist/plugin/landingPage/graphqlPlayground';

// import {CronJob} from './cronJob/index';
import {pubSub} from './graphql/pubSub';

import SubscriptionResolver from './subscription/resolvers/subscription.resolvers';

// import {BackgroundTask} from './utilities/cron/backgroundTask';
// import StartRecruitmentDb from './startup/recruitmentDb';

async function bootstrap() {
  const app: any = express();

  const httpServer = http.createServer(app);

  // Instantiate DB
  Startdb();

  // CronJob.startCronJob();

  const schema = await buildSchema({
    resolvers,
    pubSub: pubSub,
    nullableByDefault: true,
    container: Container,
    authChecker,
  });

  // const whitelist = [process.env.CLIENT_SIDE_URL, process.env.GRAPH_STUDIO];
  const corsOptions = {
    origin: [
      process.env.CLIENT_SIDE_URL || '',
      process.env.GRAPH_STUDIO || '',
      'http://localhost:45000',
      'http://localhost:3000',
    ].filter(Boolean),

    credentials: true,
  };

  // protecting our api from unauthorized origins
  app.use(cors(corsOptions));

  const MongodbStore = MdStore(session);
  // store each user session identifier on db
  const store = new MongodbStore({
    uri: dbString as string,
    collection: 'session',
  });

  console.log(process.env.NODE_ENV, 'environment');
  // initializing session and httpOnly cookies
  if (process.env.NODE_ENV !== 'local') {
    console.log('we run here');
    app.set('trust proxy', 1);
  }

  app.use(
    session({
      name: 'quill',
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      proxy: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
      store,
      unset: 'destroy',
    })
  );

  // initialize passport for auth
  app.use(passport.initialize());
  app.use(passport.session());
  app.set('trust proxy', 1);

  app.use(express.urlencoded({extended: true}));
  app.use(express.json());
  // app.use(graphqlUploadExpress({maxFileSize: 10000000, maxFiles: 10}));

  // This middleware should be added before calling `applyMiddleware`.
  // app.use(graphqlUploadExpress({maxFileSize: 10000000, maxFiles: 10}));

  const getDynamicContext = async (ctx: Context) => {
    if (ctx.connectionParams?.user) {
      return {currentUser: ctx.connectionParams.user};
    }
    // Otherwise let our resolvers know we don't have a current user
    return {currentUser: null};
  };

  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  // Stripe webhook endpoint
  app.post(
    '/stripe-webhook',
    express.json({type: 'application/json'}),
    async (req: express.Request, res: express.Response) => {
      const event = req.body;
      console.log(event, 'from here');

      // Handle the event
      switch (event.type) {
        case 'charge.succeeded':
          // const paymentIntent = event.data.object;
          // Then define and call a method to handle the successful payment intent.
          // await new SubscriptionResolver().handleStripeEvent(event);
          break;
        case 'customer.subscription.created':
          // const paymentMethod = event.data.object;
          // Then define and call a method to handle the successful attachment of a PaymentMethod.
          // handlePaymentMethodAttached(paymentMethod);
          await new SubscriptionResolver().handleStripeEvent(event);
          break;
        case 'customer.subscription.updated':
          // const paymentMethod = event.data.object;
          // Then define and call a method to handle the successful attachment of a PaymentMethod.
          // handlePaymentMethodAttached(paymentMethod);
          await new SubscriptionResolver().handleStripeEvent(event);
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
          break;
      }

      // Return a response to acknowledge receipt of the event
      res.json({received: true});
      // const sig = req.headers['stripe-signature'] as string;

      // try {
      //   const event = stripe.webhooks.constructEvent(
      //     req.body,
      //     sig,
      //     process.env.STRIPE_SECRET_KEY as string
      //   );
      //   console.log(event);
      //   // Handle the event using the GraphQL resolver
      //   // await new SubscriptionResolver().handleStripeEvent({
      //   //   body: JSON.stringify(event),
      //   // });
      // } catch (err) {
      //   console.error('Error verifying Stripe webhook signature:', err.message);
      //   return res.sendStatus(400);
      // }

      res.sendStatus(200);
    }
  );

  // app.post(
  //   '/delete-account',
  //   express.json({type: 'application/json'}),
  //   async (_, res) => res.send('received')
  // );

  // Create the apollo server
  const apolloServer = new ApolloServer({
    schema,
    context: ({req, res}: {req: any; res: any}) => buildContext({req, res}),
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({httpServer: httpServer}),
      // process.env.NODE_ENV !== 'local' &&
      //   ApolloServerPluginUsageReporting({
      //     sendErrors: {unmodified: true},
      //   }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      // process.env.NODE_ENV !== 'local'
      //   ? ApolloServerPluginLandingPageProductionDefault({footer: false})
      //   : // : ApolloServerPluginLandingPageLocalDefault({footer: false}),
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    formatError: (formattedError: GraphQLError) => {
      console.log(formattedError, 'graphql formatted error.');
      return formattedError;
      const isProd = process.env.NODE_ENV !== 'local';
      if (!isProd) {
        return formattedError;
      } else {
        switch (formattedError.extensions.code) {
          case ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED:
            return {
              message:
                "Your query doesn't match the schema. Try double-checking it!",
            };

          case ApolloServerErrorCode.INTERNAL_SERVER_ERROR:
            const internalServerError = {
              ...formattedError,
              message:
                formattedError.message === 'Invalid email or password'
                  ? formattedError.message
                  : 'Internal server error',
            };
            return {
              message: internalServerError.message,
            };

          default:
            return {
              message: 'Something went wrong',
            };
        }
      }
    },
  });

  await apolloServer.start();

  // apply middleware to server
  apolloServer.applyMiddleware({app, path: '/graphql', cors: corsOptions});

  // Create our WebSocket server using the HTTP server we just set up.
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  useServer(
    {
      schema,
      context: ctx => {
        return getDynamicContext(ctx);
      },
    },
    wsServer
  );

  // const backgroundTask = new BackgroundTask();
  // backgroundTask.start();

  // Save the returned server's info so we can shutdown this server later
  const serverCleanup = useServer({schema}, wsServer);

  // app.listen on express server
  // app.use('*', (req, res) =>
  //   res.send(`route not found for ${req.originalUrl}`)
  // );

  await new Promise<void>(resolve =>
    httpServer.listen({port: process.env.PORT}, resolve)
  );

  console.log(
    `🚀 Server started on http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
  );
}

bootstrap();
