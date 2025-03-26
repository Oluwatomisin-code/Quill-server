import {pubSub} from '../../../graphql/pubSub';
import {createNotificationInput} from '../../../Notification/dto/notification.input';
// import User, {UserRole} from '../../../users/models/users.schema';
import {ReturnModelType} from '@typegoose/typegoose';
import {GraphQLError} from 'graphql';
import {Notification} from '../notification.schema';

// Function to create and send notifications to all admins
// const notifyAdmins = async (
//   input: createNotificationInput,
//   userModel: ReturnModelType<typeof User>,
//   notificationModel: ReturnModelType<typeof Notification>
// ) => {
//   try {
//     // Step 1: Query for all users with the ADMIN role
//     const adminUsers = await userModel.find({role: UserRole.ADMIN});

//     if (adminUsers.length > 0) {
//       // Step 2: Create and send a notification to each admin
//       for (const admin of adminUsers) {
//         const notification = await createNotificationForAdmin(
//           input,
//           notificationModel
//         );

//         console.log(notification, 'notification');

//         // Step 3: Publish the notification to PubSub (for GraphQL subscription)
//         pubSub.publish('NOTIFICATIONS', notification);

//         // Optionally, send an email notification to each admin (if you want)
//         if (admin.email) {
//           await sendEmailNotification(admin.email, notification);
//         }
//       }
//     } else {
//       console.log('No admins found.');
//     }
//   } catch (error) {
//     console.error('Error notifying admins:', error);
//     throw new Error('Failed to notify admins');
//   }
// };

// Helper function to create notification for each admin
const createNotificationForAdmin = async (
  input: createNotificationInput,
  notificationModel: ReturnModelType<typeof Notification>
): Promise<any> => {
  try {
    // Step 1: Create the notification in DB
    const newDoc = new notificationModel({
      ...input,
      user: null, // Admin notifications don't have a specific user
    });
    const notification = await newDoc.save();

    // Step 2: Populate the 'sender' field
    await notification.populate(['sender']);

    if (!notification) {
      throw new GraphQLError('Failed to create admin notification');
    }

    // Step 3: Publish to PubSub (for GraphQL subscription)
    const notificationPayload = {
      ...notification.toObject(),
      sender:
        typeof notification.sender === 'string'
          ? notification.sender
          : notification.sender?._id,
    };

    await pubSub.publish('NOTIFICATIONS', notificationPayload);

    return notification;
  } catch (error) {
    console.error('Error creating admin notification:', error);
    throw new GraphQLError('Failed to create admin notification');
  }
};

// // Helper function to send an email notification
// const sendEmailNotification = async (email: string, notification: any) => {
//   console.log(email, notification, 'log email and not');
//   // Use your nodemailer code to send the email
//   // For example, send notification.subtext in the email body
// };

export default createNotificationForAdmin;
