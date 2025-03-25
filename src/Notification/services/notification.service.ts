import {Service} from 'typedi';
import ClientResponse from '../../utilities/response';
import {GraphQLError} from 'graphql';
import NotificationModel from '../models/notification.model';
import {
  deleteNotificationsInput,
  notificationsFilterInput,
  createNotificationInput,
} from 'Notification/dto/notification.input';

@Service()
export class NotificationService {
  constructor() {}

  async getNotifications(input: notificationsFilterInput & {userId: string}) {
    try {
      const notifications = await NotificationModel.getNotifications(input);
      return new ClientResponse(201, true, 'done', notifications);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async createNotification(input: createNotificationInput) {
    try {
      const notification = await NotificationModel.createNotification(input);
      return new ClientResponse(201, true, 'done', notification);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async createNotificationForAdmin(input: createNotificationInput) {
    try {
      const notification = await NotificationModel.createNotificationForAdmin(
        input
      );
      return new ClientResponse(201, true, 'done', notification);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async deleteNotifications(
    input: deleteNotificationsInput & {userId: string}
  ) {
    try {
      const notifications = await NotificationModel.deleteNotifications(input);
      return new ClientResponse(201, true, 'done', notifications);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }
}
