import {Field, ObjectType} from 'type-graphql';
import ResolverResponse from '../../../utilities/resolverResponse';
import Subscriptions, {
  PaymentEvent,
  PaymentIntent,
  StripeCustomer,
} from '../../../subscription/models/subscription.schema';

@ObjectType()
export class createPaymentIntentReturnType extends ResolverResponse {
  @Field(() => PaymentIntent)
  data: PaymentIntent;
}

@ObjectType()
export class handleStripeEventReturnType extends ResolverResponse {
  @Field(() => PaymentEvent)
  data: PaymentEvent;
}

@ObjectType()
export class CheckoutSession {
  @Field()
  subscriptionId?: string;

  @Field()
  customer?: StripeCustomer;

  @Field()
  clientSecret?: string;
}
@ObjectType()
export class SubscriptionPlanObj {
  @Field()
  id?: string;

  @Field()
  name?: string;

  @Field()
  priceId?: string;

  @Field()
  amount?: number;
}

@ObjectType()
export class createSubscriptionReturnType extends ResolverResponse {
  @Field(() => CheckoutSession)
  data: CheckoutSession;
}
@ObjectType()
export class updateSubscriptionReturnType extends ResolverResponse {
  @Field(() => CheckoutSession)
  data: CheckoutSession;
}

@ObjectType()
export class SubscriptionResponse extends ResolverResponse {
  @Field(() => Subscriptions)
  data: Subscriptions;
}
@ObjectType()
export class SubscriptionPlansResponse extends ResolverResponse {
  @Field(() => [SubscriptionPlanObj])
  data: SubscriptionPlanObj[];
}
