/* eslint-disable no-empty-function */
import {Arg, Authorized, Ctx, Mutation, Query, Resolver} from 'type-graphql';
import {Service} from 'typedi';
import User, {
  SubscriptionPlan,
  UserRole,
} from '../../users/models/users.schema';
import {SubscriptionService} from '../services/subscription.service';
import Stripe from 'stripe';
import ClientResponse from '../../utilities/response';
import {
  SubscriptionPlansResponse,
  SubscriptionResponse,
  createPaymentIntentReturnType,
  createSubscriptionReturnType,
  // updateSubscriptionReturnType,
} from '../../subscription/dto/returnTypes/subscription.returnTypes';
import {
  PaymentEventInput,
  PaymentIntentAndCustomerInput,
} from '../../subscription/dto/inputs/subscription.input';
import UserModel from '../../users/models/users.model';

// import {PaymentEvent} from '../../subscription/models/subscription.schema';

@Service()
@Resolver()
export default class SubscriptionResolver {
  private stripe;
  constructor(private readonly subscriptionService?: SubscriptionService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  @Authorized([UserRole.CLIENT])
  @Mutation(() => createPaymentIntentReturnType)
  async createPaymentIntent(
    @Arg('input') input: PaymentIntentAndCustomerInput
  ) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: input.amount,
      currency: 'usd',
    });
    const customer = await this.stripe.customers.create({
      email: input.email,
    });
    const data = {
      paymentIntentSecret: paymentIntent.client_secret,
      customer: customer,
    };
    return new ClientResponse(201, true, 'done', data);
  }

  @Mutation(() => Boolean)
  async handleStripeEvent(@Arg('event') event: PaymentEventInput) {
    const email = (event as any)?.data?.object?.metadata?.email;
    const customerId = (event as any)?.data?.object?.customer;
    const priceId = (event as any)?.data?.object?.metadata?.price;

    const user = await UserModel.findOne({email: email});
    console.log((event as any)?.data?.object?.customer, 'customer data');
    console.log(user, customerId, email, priceId, 'customer data');

    const newSubscription = await this.subscriptionService?.createSubscription({
      associatedClient: user?._id,
      stripeCustomerId: customerId,
      stripeSubscriptionId: (event as any)?.data?.object?.id,
      subscriptionType:
        priceId === 'price_1QJIigF4tqT65kfNoeJfwlvH'
          ? SubscriptionPlan?.BASIC
          : priceId === 'price_1QJIjfF4tqT65kfNSfHDvtwP'
          ? SubscriptionPlan?.PREMIUM
          : SubscriptionPlan.ULTIMATE,
      startDate: Date.now(),
      endDate: new Date().setMonth(new Date().getMonth() + 1),
    });

    console.log(newSubscription, 'newSub');
    const updatedUserSub = await UserModel.findOneAndUpdate(
      {email: email},
      {
        subscriptionPlan:
          priceId === 'price_1QJIigF4tqT65kfNoeJfwlvH'
            ? SubscriptionPlan?.BASIC
            : priceId === 'price_1QJIjfF4tqT65kfNSfHDvtwP'
            ? SubscriptionPlan?.PREMIUM
            : SubscriptionPlan.ULTIMATE,
        paymentRef: (event as any)?.data?.object?.id,
      }
    );

    console.log(updatedUserSub);

    return true;
  }

  @Mutation(() => createSubscriptionReturnType)
  async createSubscription(
    @Arg('priceId') priceId: string,
    @Ctx('getUser') getUser: () => User
  ) {
    const user = getUser();
    // Fetch customer ID associated with the user from your database
    const customer = await this.subscriptionService?.createOrRetrieveCustomer(
      user?.email
    );

    const subscription = await this.subscriptionService?.createCheckoutSession(
      priceId,
      customer?.id as string
    );

    // console.log(subscription?.created);

    await this.subscriptionService?.createSubscription({
      associatedAgent: user?._id,
      stripeCustomerId: customer?.id,
      stripeSubscriptionId: subscription?.id,
      subscriptionType:
        priceId === 'price_1QJIigF4tqT65kfNoeJfwlvH'
          ? SubscriptionPlan?.BASIC
          : priceId === 'price_1QJIjfF4tqT65kfNSfHDvtwP'
          ? SubscriptionPlan?.PREMIUM
          : SubscriptionPlan.ULTIMATE,
      startDate: Date.now(),
      endDate: new Date().setMonth(new Date().getMonth() + 1),
    });

    const data = {
      subscriptionId: subscription?.id,
      //@ts-ignore
      clientSecret: subscription?.latest_invoice?.payment_intent?.client_secret,
      customer,
    };
    return new ClientResponse(201, true, 'done', data);
  }

  // @Mutation(() => updateSubscriptionReturnType)
  // async updateSubscription(
  //   @Arg('priceId') priceId: string,
  //   @Ctx('getUser') getUser: () => User
  // ) {
  //   const user = getUser();
  //   // Fetch customer ID associated with the user from your database
  //   const customer = await this.subscriptionService?.createOrRetrieveCustomer(
  //     user?.email
  //   );
  //   const fetchSubscription = await this.stripe.subscriptions.list({
  //     customer: customer?.id as string,
  //   });
  //   const updatedSubscription = await this.stripe.subscriptions.update(
  //     fetchSubscription.data[0].id,
  //     {
  //       items: [
  //         {id: fetchSubscription.data[0].items.data[0].id, price: priceId},
  //       ],
  //     }
  //   );
  //   console.log(updatedSubscription);
  // }

  @Authorized([UserRole.CLIENT])
  @Query(() => SubscriptionResponse)
  async getSubscriptionByUserId(
    @Ctx('getUser')
    getUser: () => User
  ) {
    return await this.subscriptionService?.getSubscriptionByUserId({
      role: getUser().role,
      userId: getUser()._id,
    });
  }

  @Authorized([UserRole.CLIENT])
  @Query(() => SubscriptionPlansResponse)
  async fetchAllProductAndPrices() {
    return await this.subscriptionService?.fetchStripeProducts();
  }
}
