import {getModelForClass} from '@typegoose/typegoose';
import Notification from './notification.schema';

const NotificationModel = getModelForClass(Notification);

export default NotificationModel;
