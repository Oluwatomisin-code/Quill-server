import UserResolver from '../users/resolvers/user.resolvers';
import UserAuthResolver from '../users/resolvers/user.auth.resolvers';

import NotificationResolver from '../Notification/resolvers/notification.resolvers';
import SubscriptionResolver from '../subscription/resolvers/subscription.resolvers';
import ApplicationResolver from '../application/resolvers/application.resolvers';
import ProjectsResolver from '../projects/resolvers/projects.resolvers';

export const resolvers = [
  UserResolver,
  UserAuthResolver,
  ProjectsResolver,
  NotificationResolver,
  SubscriptionResolver,
  ApplicationResolver,
] as const;
