import {prop, Ref, ReturnModelType} from '@typegoose/typegoose';
import {Field, ObjectType, registerEnumType} from 'type-graphql';
import User from '../../users/models/users.schema';

import getNotifications from './methods/getNotifications';
import {
  createNotificationInput,
  deleteNotificationsInput,
  notificationsFilterInput,
} from 'Notification/dto/notification.input';
import createNotification from './methods/createNotification';
import createNotificationForAdmin from './methods/createNotificationForAdmin';
import deleteNotifications from './methods/deleteNotification';
import Project from 'projects/models/project.schema';

export enum NotificationType {
  PROJECTCREATED = 'PROJECT_CREATED',
  PROJECTEDITED = 'PROJECT_EDITED',
  PROJECTCANCELED = 'PROJECT_CANCELED',

  PROJECT_ASSIGNED = 'PROJECT_ASSIGNED',
  PROJECT_FILE_SUBMITTED = 'PROJECT_FILE_SUBMITTED',

  ACCOUNTCREATED = 'ACCOUNT_CREATED',
  PASSWORDCHANGED = 'PASSWORD_CHANGED',
}

export enum NotificationReferenceType {
  USER = 'User',

  PROJECT = 'Contract',
}
registerEnumType(NotificationType, {
  name: 'NotificationType',
});
registerEnumType(NotificationReferenceType, {
  name: 'NotificationReferenceType',
});

@ObjectType()
export class Notification {
  @Field()
  _id?: string;

  @Field(() => User)
  @prop({ref: () => User, required: true})
  user: Ref<User>;

  @Field(() => User)
  @prop({ref: () => User, required: false})
  sender: Ref<User>;

  @Field()
  @prop({required: true})
  title: NotificationType;

  @Field()
  @prop()
  subtext: string;

  @Field()
  @prop()
  status: string;

  @Field()
  @prop()
  href: string;

  @Field()
  @prop()
  referenceType: NotificationReferenceType;

  @Field(() => String)
  @prop({refPath: 'type', required: true})
  referenceDoc: Ref<User | Project>;

  @Field()
  @prop({default: Date.now()})
  createdAt: Date;

  @Field()
  @prop({default: false})
  read: boolean;

  public static async getNotifications(
    this: ReturnModelType<typeof Notification>,
    input: notificationsFilterInput & {userId: string}
  ) {
    return getNotifications(this, input);
  }

  public static async createNotification(
    this: ReturnModelType<typeof Notification>,
    input: createNotificationInput
  ) {
    return createNotification(this, input);
  }

  public static async createNotificationForAdmin(
    this: ReturnModelType<typeof Notification>,
    input: createNotificationInput
  ): Promise<any> {
    return createNotificationForAdmin(input, this);
  }

  public static async deleteNotifications(
    this: ReturnModelType<typeof Notification>,
    input: deleteNotificationsInput
  ) {
    return deleteNotifications(this, input);
  }
}
