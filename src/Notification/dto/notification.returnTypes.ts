import Notification from '../models/notification.schema';
import {Field, ObjectType} from 'type-graphql';
import ResolverResponse from '../../utilities/resolverResponse';

@ObjectType()
export class notificationSub extends Notification {}
@ObjectType()
export class notificationResponse extends ResolverResponse {
  @Field(() => Notification)
  data: Notification;
}
@ObjectType()
export class notificationsResponse extends ResolverResponse {
  @Field(() => [Notification])
  data: Notification[];
}
// ObjectType();
// export type NotificationType = {
//   id: string;
//   message: string;
//   createdAt: Date;
// };
