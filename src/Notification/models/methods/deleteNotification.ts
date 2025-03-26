import {ReturnModelType} from '@typegoose/typegoose';
import Notification from '../notification.schema';
import {deleteNotificationsInput} from '../../../Notification/dto/notification.input';

export default async function deleteNotifications(
  notificationModel: ReturnModelType<typeof Notification>,
  input: deleteNotificationsInput
) {
  return await notificationModel.findOneAndDelete(input);
}
