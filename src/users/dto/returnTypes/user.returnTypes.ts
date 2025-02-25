import {Field, ObjectType} from 'type-graphql';
import ResolverResponse from '../../../utilities/resolverResponse';
import User from '../../models/users.schema';

@ObjectType()
export class UserResponse extends ResolverResponse {
  @Field(() => User)
  data: User;
}

@ObjectType()
export class UserWithToken extends User {
  @Field(() => String)
  token: string;
  user: User;
}

@ObjectType()
export class LoginResponse extends ResolverResponse {
  @Field(() => UserWithToken)
  data: UserWithToken;
}

@ObjectType()
export class UsersResponse extends ResolverResponse {
  @Field(() => [User])
  data: User[];
}

@ObjectType()
export class UsersRecentActivityResponse extends ResolverResponse {
  @Field(() => [User])
  data: User[];
}

@ObjectType()
export class FileUpload {
  @Field(() => String)
  url: string;
}

@ObjectType()
export class FileUploadResponse extends ResolverResponse {
  @Field(() => FileUpload)
  data: FileUpload;
}
