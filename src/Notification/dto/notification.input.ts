import {
  NotificationReferenceType,
  NotificationType,
} from '../models/notification.schema';
import {Field, InputType} from 'type-graphql';

@InputType()
export class notificationsFilterInput {
  @Field({nullable: true})
  current: number;

  @Field({nullable: true})
  limit: number;
}

@InputType()
export class NotificationSubscriptionArgs {
  @Field({nullable: true})
  topic?: string;

  @Field({nullable: true})
  userId?: string;

  // Add more fields as needed
}

@InputType()
export class createNotificationInput {
  @Field({nullable: false})
  user?: string;

  @Field({nullable: true})
  sender: string;

  @Field(() => NotificationType, {nullable: false})
  title: NotificationType;

  @Field({nullable: true})
  subtext: string;

  @Field({nullable: true})
  status: string;

  @Field(() => NotificationReferenceType, {nullable: false})
  referenceType: NotificationReferenceType;

  @Field({nullable: false})
  referenceDoc: string;

  @Field({nullable: true})
  createdAt: Date;
}

@InputType()
export class deleteNotificationsInput {
  @Field({nullable: true})
  id?: string;

  @Field({nullable: true})
  referenceDoc?: string;

  @Field({nullable: true})
  title?: string;
}
