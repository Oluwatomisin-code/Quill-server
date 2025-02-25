import {Field, InputType} from 'type-graphql';

@InputType()
export class PaymentIntentAndCustomerInput {
  @Field({nullable: false})
  amount: number;

  @Field(() => String, {nullable: false})
  email: string;
}

@InputType()
export class PaymentEventInput {
  @Field()
  id: string;

  @Field()
  type: string;

  // Add more fields as needed
}
