import {ReturnModelType} from '@typegoose/typegoose';
import Subscriptions from '../subscription.schema';
import {GraphQLError} from 'graphql';

export default async function createSubscription(
  subscriptionModel: ReturnModelType<typeof Subscriptions>,
  input: {}
) {
  try {
    const newDoc = new subscriptionModel({...input});
    const savedData = (await newDoc.save()).populate(['associatedAgent']);

    return savedData;
  } catch (error) {
    console.log(error);
    throw new GraphQLError(error);
  }
}
