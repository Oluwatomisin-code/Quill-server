import {MongoosePubSub} from 'graphql-mongoose-subscriptions';
import {dbString} from '../config/startup/database';
import mongoose from 'mongoose';

mongoose.connect(dbString || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const pubSub = new MongoosePubSub();
