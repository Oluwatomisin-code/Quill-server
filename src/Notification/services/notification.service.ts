import {Service} from 'typedi';
import ClientResponse from '../../utilities/response';
import {GraphQLError} from 'graphql';
import NotificationModel from '../models/notification.model';
import {
  deleteNotificationsInput,
  notificationsFilterInput,
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
