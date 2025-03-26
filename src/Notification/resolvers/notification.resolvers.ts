/* eslint-disable no-empty-function */
import {
  Arg,
  Authorized,
  Resolver,
  Query,
  Ctx,
  Subscription,
  Root,
} from 'type-graphql';
import {Service} from 'typedi';
import {NotificationService} from '../services/notification.service';
import {
  notificationsResponse,
  notificationSub,
} from '../dto/notification.returnTypes';
import User, {UserRole} from '../../users/models/users.schema';
import {
  notificationsFilterInput,
  NotificationSubscriptionArgs,
} from '../dto/notification.input';

@Service()
@Resolver()
export default class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Authorized([UserRole.ADMIN, UserRole.CLIENT, UserRole.LANCER])
  @Query(() => notificationsResponse)
  async getNotifications(
    @Arg('input') input: notificationsFilterInput,
    @Ctx('getUser') getUser: () => User
  ) {
    const userId = getUser()._id;
    return this.notificationService.getNotifications({...input, userId});
  }

  // @Subscription(() => notificationResponse, {
  //   topics: 'NOTIFICATIONS',
  //   // filter: ({payload, args}) => args.priorities.includes(payload.priority),
  // })
  // async newNotification(
  //   @Root() notificationPayload: notificationResponse,
  //   @Arg('args') args: NotificationSubscriptionArgs
  // ) {
  //   console.log('called', notificationPayload);
  //   if (args?.userId === (notificationPayload?.data?.user as User)?._id) {
  //     return new ClientResponse(201, true, 'done', notificationPayload);
  //   }
  //   return null;
  // }

  // Subscription to listen for new notifications
  @Subscription(() => notificationSub, {
    topics: 'NOTIFICATIONS',
    filter: ({payload, args}) => {
      if (!args?.userId) return true; // If no userId specified, receive all notifications
      return payload.user?.toString() === args.userId;
    },
  })
  newNotification(
    @Root() notification: notificationSub,
    @Arg('args') args: NotificationSubscriptionArgs
  ): notificationSub {
    console.log('Notification received:', notification, args);
    return notification;
  }
}
