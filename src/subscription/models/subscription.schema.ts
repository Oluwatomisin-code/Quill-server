import {
  index,
  modelOptions,
  prop,
  Ref,
  ReturnModelType,
  Severity,
} from '@typegoose/typegoose';
import {Field, ObjectType} from 'type-graphql';
import User, {SubscriptionPlan} from '../../users/models/users.schema';
import createSubscription from './methods/createSubscription';
// import updateSubscription from './methods/updateSubscription';
import getSubscriptionByUserId from './methods/getSubscriptionByUserId';

@ObjectType()
export class StripeCustomer {
  @Field()
  id: string;
  @Field()
  object: string;
  @Field()
  address: number;
  @Field()
  balance: number;
  @Field()
  created: number;
  @Field()
  currency: number;
  @Field()
  default_source: number;
  @Field()
  delinquent: boolean;
  @Field()
  description: number;
  @Field()
  discount: number;
  @Field()
  email: string;
  @Field()
  invoice_prefix: string;

  // Add other fields as needed to represent a Stripe customer
}

@ObjectType()
export class PaymentEvent {
  @Field()
  id: string;

  @Field()
  type: string;

  // Add more fields as needed
}

@ObjectType()
export class PaymentIntent {
  @Field()
  _id: string;

  @Field()
  @prop({required: true})
  paymentIntentSecret: string;

  @Field(() => StripeCustomer)
  @prop({required: true})
  customer: StripeCustomer;
}

//----------------------------------------user class schema--------------------------------------------
@ObjectType({
  description: 'A Subscription',
})
@index({name: 'text'})
@modelOptions({options: {allowMixed: Severity.ALLOW}})
class Subscriptions {
  @Field()
  _id: string;

  @Field(() => User)
  @prop({required: true, ref: () => User})
  associatedClient: Ref<User>;

  @Field(() => String)
  @prop({required: true})
  stripeCustomerId: string;

  @Field(() => String)
  @prop({required: true})
  stripeSubscriptionId: string;

  @Field(() => PaymentIntent)
  @prop({required: false})
  paymentIntent: PaymentIntent;

  @Field()
  @prop({required: false})
  amount: number;

  @Field(() => SubscriptionPlan)
  @prop({required: true, default: SubscriptionPlan.NIL})
  subscriptionType: SubscriptionPlan;

  @Field()
  @prop({default: Date.now})
  startDate: Date;

  @Field()
  @prop({})
  endDate: Date;

  @Field()
  @prop({default: false})
  status: Boolean;

  @Field()
  @prop({default: Date.now})
  createdAt: Date;

  public static async createSubscription(
    this: ReturnModelType<typeof Subscriptions>,
    input: {}
  ) {
    return createSubscription(this, input);
  }
  // public static async updateSubscription(
  //   this: ReturnModelType<typeof Subscription>,
  //   input: {}
  // ) {
  //   return updateSubscription(this, input);
  // }
  public static async getSubscriptionByUserId(
    this: ReturnModelType<typeof Subscriptions>,
    input: {role: string} & {userId: string}
  ) {
    return getSubscriptionByUserId(this, input);
  }
}

export default Subscriptions;
//dev....mongodb+srv://tomisintomori:qwerty12@ezrealtour.hqdgfhx.mongodb.net/?retryWrites=true&w=majority
//stripe test key sk_test_51OK12MKQO9fflg7Cegj1EWYtqgRG5qpKgjHCIz9b1RbyNeUKVhoEwBm1Q22slfr7yfvjt8YAyNrVXcOQR7NbBY6t00by4ieGy2
//stripe public key pk_test_51OK12MKQO9fflg7CqNGGYz5enZ1KVsNLgTdDxwh77nKgW26AWg4DHG46gZB8rE0z2O40SthIlgkGf7YkbxNmN8DQ0010h8POG1
//mongodb pass zUmRyzuq26zB4pIi
// mongodb+srv://GarrettB:<password>@cluster0.6j5np3n.mongodb.net/?retryWrites=true&w=majority
//basic price price_1Obn1tKQO9fflg7CmHTgUl4T
//premium p price_1Obn38KQO9fflg7CNzDszxAZ
//mongodb+srv://GarrettB:zUmRyzuq26zB4pIi@cluster0.6j5np3n.mongodb.net/?retryWrites=true&w=majority
