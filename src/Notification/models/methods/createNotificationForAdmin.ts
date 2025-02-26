import {getModelForClass} from '@typegoose/typegoose';
import {pubSub} from '../../../graphql/pubSub';
import {createNotificationInput} from 'Notification/dto/notification.input';
import Notification from '../../../Notification/models/notification.model'; // Adjust to your actual path
import User, {UserRole} from '../../../users/models/users.schema';

const userModel = getModelForClass(User);

// Function to create and send notifications to all admins
const notifyAdmins = async (input: createNotificationInput) => {
  try {
    // Step 1: Query for all users with the ADMIN role
    const adminUsers = await userModel.find({role: UserRole.ADMIN});

    if (adminUsers.length > 0) {
      // Step 2: Create and send a notification to each admin
      for (const admin of adminUsers) {
        const notification = await createNotificationForAdmin(admin._id, input);

        console.log(notification, 'notification');

        // Step 3: Publish the notification to PubSub (for GraphQL subscription)
        pubSub.publish('NOTIFICATIONS', notification);
        // pubSub.publish('STR', 'SYII');

        // Optionally, send an email notification to each admin (if you want)
        if (admin.email) {
          await sendEmailNotification(admin.email, notification);
        }
      }
    } else {
      console.log('No admins found.');
    }
  } catch (error) {
    console.error('Error notifying admins:', error);
    throw new Error('Failed to notify admins');
  }
};

// Helper function to create notification for each admin
const createNotificationForAdmin = async (
  adminId: string,
  input: createNotificationInput
) => {
  try {
    const notification = new Notification({
      ...input,
      user: adminId, // The admin userId
      title: 'Admin Notification', // Customize as needed
    });

    const newNotification = await notification.save(); // Save the notification to DB
    return newNotification;
    // return await newNotification.populate(['user', 'sender']);
  } catch (error) {
    console.error('Error creating notification for admin:', error);
    throw new Error('Failed to create notification for admin');
  }
};

// Helper function to send an email notification
const sendEmailNotification = async (email: string, notification: any) => {
  console.log(email, notification, 'log email and not');
  // Use your nodemailer code to send the email
  // For example, send notification.subtext in the email body
};

export default notifyAdmins;
