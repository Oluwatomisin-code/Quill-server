/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
import {GraphQLError} from 'graphql';
import Stripe from 'stripe';
import SubscriptionModel from '../../subscription/models/subscription.model';
import {Service} from 'typedi';
import ClientResponse from '../../utilities/response';

@Service()
export class SubscriptionService {
  private stripe;
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  async createCheckoutSession(priceId: string, customerId: string) {
    try {
      // Create the subscription. Note we're expanding the Subscription's
      // latest invoice and that invoice's payment_intent
      // so we can pass it to the front end to confirm the payment
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: {save_default_payment_method: 'on_subscription'},
        expand: ['latest_invoice.payment_intent'],
      });
      return subscription;
    } catch (error) {
      throw error;
    }
  }

  // Function to create a customer or retrieve existing customer
  async createOrRetrieveCustomer(
    email: string
  ): Promise<{id: string | null; email?: string | null}> {
    try {
      // Check if the customer with the given email already exists
      const existingCustomer = await this.stripe.customers.list({
        email: email,
        limit: 1,
      });

      if (existingCustomer.data.length > 0) {
        // If customer exists, return the existing customer ID
        return {
          id: existingCustomer.data[0].id,
          email: existingCustomer.data[0].id,
        };
      } else {
        // If customer doesn't exist, create a new customer
        const newCustomer = await this.stripe.customers.create({
          email: email,
        });

        return {id: newCustomer.id, email: newCustomer?.email};
      }
    } catch (error) {
      console.error('Error creating/retrieving customer:', error.message);
      throw error;
    }
  }

  //Function to create subscription in db
  async createSubscription(input: {}) {
    try {
      const subscription = await SubscriptionModel.createSubscription(input);

      return new ClientResponse(201, true, 'done', subscription);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  // // update subscriptions in db
  // async updateSubscription(input: {}) {
  //   try {
  //     const subscription = await SubscriptionModel.updateSubscription(input);

  //     return new ClientResponse(201, true, 'done', subscription);
  //   } catch (error) {
  //     throw new GraphQLError(error);
  //   }
  // }

  //get subscriptions by userId
  async getSubscriptionByUserId({
    role,
    userId,
  }: {role: string} & {userId: string}) {
    try {
      const subscription = await SubscriptionModel.getSubscriptionByUserId({
        role,
        userId,
      });
      // console.log(subscription, 'sub');
      return new ClientResponse(201, true, 'done', subscription);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async fetchStripeProducts() {
    try {
      const prices = await this.stripe.prices.list();
      const products = await this.stripe.products.list();

      const subscription_plans = products.data.map((i, index) => {
        const price = prices.data?.map(j => {
          if ((i.default_price = j.id))
            return {priceId: j.id, amount: j.unit_amount};
          return;
        });
        return {
          id: i.id,
          name: i.name,
          priceId: price[index]?.priceId,
          amount: (price[index]?.amount as number) / 100,
        };
      });

      return new ClientResponse(201, true, 'done', subscription_plans);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }
}
