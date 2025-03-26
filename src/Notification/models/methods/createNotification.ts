import {pubSub} from '../../../graphql/pubSub';
import nodemailer from 'nodemailer';
import {ReturnModelType} from '@typegoose/typegoose';
import {createNotificationInput} from '../../../Notification/dto/notification.input';
import Notification from '../../../Notification/models/notification.model';
import User from '../../../users/models/users.schema';
import {GraphQLError} from 'graphql';

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

// Function to create a notification
const createNotification = async (
  notificationModel: ReturnModelType<typeof Notification>,
  input: createNotificationInput
): Promise<any> => {
  try {
    // Step 1: Create the notification in DB
    const newDoc = new notificationModel({...input});
    const notification = await newDoc.save();

    // Step 2: Populate the 'user' and 'sender' fields
    await notification.populate(['user', 'sender']);

    if (!notification) {
      throw new GraphQLError('Failed to create notification');
    }

    // Step 3: Publish to PubSub (for GraphQL subscription)
    const notificationPayload = {
      ...notification.toObject(),
      user:
        typeof notification.user === 'string'
          ? notification.user
          : notification.user?._id,
      sender:
        typeof notification.sender === 'string'
          ? notification.sender
          : notification.sender?._id,
    };

    await pubSub.publish('NOTIFICATIONS', notificationPayload);

    // Step 4: Send Email Notification (if applicable)
    if (input.user && (notification.user as User)?.email) {
      await sendEmailNotification(
        (notification.user as User)?.email,
        notification
      );
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new GraphQLError('Failed to create notification');
  }
};

// Helper function to send an email notification
const sendEmailNotification = async (email: string, notification: any) => {
  try {
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'New Notification',
      text: notification.subtext,
      html: `<p>${notification.subtext}</p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default createNotification;
