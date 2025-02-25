import {ReturnModelType} from '@typegoose/typegoose';

import Notification from '../notification.schema';
import {notificationsFilterInput} from 'Notification/dto/notification.input';

export default async function getNotifications(
  notificationModel: ReturnModelType<typeof Notification>,
  input: notificationsFilterInput & {userId: string}
) {
  const pageSize = (input?.limit ? Number(input?.limit || 1) : null) as number;
  console.log(pageSize);
  const skip = (
    input?.current ? Number(input?.current || 1) * pageSize : null
  ) as number;
  return await notificationModel
    .find({...input, user: input.userId})
    .sort({createdAt: -1})
    .lean()
    .skip(skip)
    .limit(pageSize)
    .populate(['user', 'sender', 'referenceDoc']);
}
