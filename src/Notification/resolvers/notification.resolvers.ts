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
  notificationResponse,
  notificationsResponse,
  notificationSub,
} from '../dto/notification.returnTypes';
import User, {UserRole} from '../../users/models/users.schema';
import {
  NotificationSubscriptionArgs,
  // NotificationSubscriptionArgs,
  notificationsFilterInput,
} from '../dto/notification.input';
import ClientResponse from '../../utilities/response';

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
  })
  newNotification(
    @Root() notification: notificationSub,
    @Arg('args') args: NotificationSubscriptionArgs
  ): notificationSub {
    console.log(notification, 'called');

    return notification;
  }
}
