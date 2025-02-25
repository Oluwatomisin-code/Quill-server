import {getModelForClass} from '@typegoose/typegoose';
import Subscription from './subscription.schema';

const SubscriptionModel = getModelForClass(Subscription);

export default SubscriptionModel;
