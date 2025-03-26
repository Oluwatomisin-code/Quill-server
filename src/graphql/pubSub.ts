import {PubSub} from 'graphql-subscriptions';
import {dbString} from '../config/startup/database';
import mongoose from 'mongoose';

mongoose.connect(dbString || '');

export const pubSub = new PubSub();
