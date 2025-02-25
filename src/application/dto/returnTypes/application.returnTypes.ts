import {Field, ObjectType} from 'type-graphql';
import ResolverResponse from '../../../utilities/resolverResponse';
import Application from '../../models/application.schema';

@ObjectType()
export class ApplicationResponse extends ResolverResponse {
  @Field(() => Application)
  data: Application;
}
@ObjectType()
export class VersionResponse extends ResolverResponse {
  @Field(() => String)
  data: String;
}
