import {ReturnModelType} from '@typegoose/typegoose';
import Subscription from '../subscription.schema';

export default async function getSubscriptionByUserId(
  SubscriptionModel: ReturnModelType<typeof Subscription>,
  input: {role: string} & {userId: string}
) {
  const subscription = await SubscriptionModel.findOne({
    associatedAgent: input.userId,
  })
    .populate('associatedAgent')
    .sort({createdAt: -1})
    .exec();

  console.log(subscription, 'subscription');
  return subscription;
}
