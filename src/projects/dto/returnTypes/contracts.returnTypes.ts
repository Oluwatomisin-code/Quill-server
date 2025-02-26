import {Field, ObjectType} from 'type-graphql';
import ResolverResponse from '../../../utilities/resolverResponse';

import Contract from '../../models/project.schema';
import {prop} from '@typegoose/typegoose';

@ObjectType()
export class ContractResponse extends ResolverResponse {
  @Field(() => Contract)
  data: Contract;
}

@ObjectType()
class Count {
  @Field()
  @prop({required: false})
  subscriptionPlan: string;

  @Field()
  @prop({required: false})
  projectCountThisMonth: number;
}

@ObjectType()
export class CountResponse extends ResolverResponse {
  @Field(() => Count)
  data: Count;
}

@ObjectType()
export class ContractsResponse extends ResolverResponse {
  @Field(() => [Contract])
  data: Contract[];
}
