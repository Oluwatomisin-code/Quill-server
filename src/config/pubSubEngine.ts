import {MongoosePubSub} from 'graphql-mongoose-subscriptions';
import {dbString} from './startup/database';
// import mongoose from 'mongoose';
// export const pubSub = new MongoosePubSub({
//   mongooseOptions: {
//     url: dbString,
//     options: {useNewUrlParser: true, useUnifiedTopology: true},
//   },
// });

// import mongoose from 'mongoose';

const mongoose = require('mongoose');
mongoose.connect(dbString || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
export const pubSub = new MongoosePubSub();
