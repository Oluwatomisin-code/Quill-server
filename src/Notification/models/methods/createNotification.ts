import {pubSub} from '../../../graphql/pubSub';
import nodemailer from 'nodemailer';
import {ReturnModelType} from '@typegoose/typegoose';
import {createNotificationInput} from 'Notification/dto/notification.input';
import Notification from 'Notification/models/notification.model'; // Adjust the import to where your Notification model is located
import User from 'users/models/users.schema';

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
    const notification = await newDoc.save(); // Await the save

    // Step 2: Populate the 'user' and 'sender' fields
    await notification.populate(['user', 'sender']); // Await the populate

    if (notification) {
      console.log(notification, 'notification');
      // Step 3: Publish to PubSub (for GraphQL subscription)
      pubSub.publish('NOTIFICATIONS', notification);

      // Step 4: Send Email Notification (if applicable)
      if (input.user && (notification.user as User)?.email) {
        await sendEmailNotification(
          (notification.user as User)?.email,
          notification
        );
      }
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new Error('Failed to create notification');
  }
};

// Helper function to send an email notification
const sendEmailNotification = async (email: string, notification: any) => {
  try {
    const mailOptions = {
      from: 'your-email@gmail.com', // sender address
      to: email, // recipient email
      subject: 'New Notification', // email subject
      text: notification.subtext, // email body text
      html: `<p>${notification.subtext}</p>`, // email body HTML
    };

    // Send email using Nodemailer
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default createNotification;
