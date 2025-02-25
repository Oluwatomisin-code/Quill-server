// import NotificationModel from '../Notification/models/notification.model';
// import ScheduleModel from '../Schedule/models/schedule.model';
// import cron from 'node-cron';
// import {
//   NotificationReferenceType,
//   NotificationType,
// } from '../Notification/models/notification.schema';
// import {ScheduleStatus, ScheduleType} from '../Schedule/models/schedule.schema';
// import getDateDifference from '../utilities/dateDifference';
// import User from 'users/models/users.schema';
// import ContractModel from '../contracts/models/contracts.model';
// import {pubSub} from '../graphql/pubSub';
// import sendPushNotification from '../Notification/models/methods/sendPushNotification';

// export class CronJob {
//   static startCronJob() {
//     // schedule reminder cron job
//     //every 12 am
//     cron.schedule('0 0 0 * * *', async () => {
//       await CronJob.sendScheduleReminder();
//     });
//     //every hour
//     cron.schedule('0 * * * * ', async () => {
//       await CronJob.sendDropfeedbackReminder();
//     });
//     //every 8:30am
//     cron.schedule('30 8 * * * *', async () => {
//       await CronJob.sendShowInterestAfterShowingReminder();
//       await CronJob.sendCloseOfEscrowReminder();
//       await CronJob.sendInspectionPeriodEndingReminder();
//     });
//   }

//   private static async sendScheduleReminder() {
//     const currentTime = new Date().toLocaleTimeString();
//     console.log(`Cron job executed at ${currentTime}`);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     console.log(today);
//     const anytimeTomorrow = new Date(today.setHours(today.getHours() + 48));
//     console.log(anytimeTomorrow, 'anytimetomorrow');

//     // Perform a MongoDB query to find notifications to send
//     try {
//       const schedulesToNotify = await ScheduleModel.find({
//         scheduleDate: {$gte: Date.now(), $lte: anytimeTomorrow},
//         status: ScheduleStatus.ACCEPTED,
//       }).populate(['associatedAgent', 'associatedBuyer']);

//       console.log('notify', schedulesToNotify);
//       if (schedulesToNotify) {
//         // Send notifications
//         for (const schedule of schedulesToNotify) {
//           const notification1 = await NotificationModel.createNotification({
//             user: (schedule?.associatedAgent as User)?._id,

//             sender: (schedule?.associatedBuyer as User)?._id,
//             title: NotificationType.SCHEDULEREMINDER,

//             subtext: `you have a ${
//               schedule?.scheduleType === 'SHOWING'
//                 ? 'touring'
//                 : schedule?.scheduleType === 'INSPECTION'
//                 ? 'inspection'
//                 : schedule?.scheduleType === 'INSPECTION-MEETING'
//                 ? 'meeting'
//                 : schedule?.scheduleType === 'WALK-THORUGH'
//                 ? 'walkthrough meeting'
//                 : schedule?.scheduleType === 'CLOSING-KEYS'
//                 ? 'closing'
//                 : ''
//             } scheduled in ${getDateDifference(
//               Date.now(),
//               schedule?.scheduleDate
//             )} with ${
//               (schedule?.associatedBuyer as User)?.firstName +
//               ' ' +
//               (schedule?.associatedBuyer as User)?.lastName
//             }`,
//             referenceType: NotificationReferenceType.SCHEDULE,
//             referenceDoc: schedule?._id,
//             status: '',
//             createdAt: new Date(),
//           });
//           const notification2 = await NotificationModel.createNotification({
//             user: (schedule?.associatedBuyer as User)?._id,
//             sender: (schedule?.associatedAgent as User)?._id,
//             title: NotificationType.SCHEDULEREMINDER,
//             subtext: `you have a ${
//               schedule?.scheduleType === 'SHOWING'
//                 ? 'touring'
//                 : schedule?.scheduleType === 'INSPECTION'
//                 ? 'inspection'
//                 : schedule?.scheduleType === 'INSPECTION-MEETING'
//                 ? 'meeting'
//                 : schedule?.scheduleType === 'WALK-THORUGH'
//                 ? 'walkthrough meeting'
//                 : schedule?.scheduleType === 'CLOSING-KEYS'
//                 ? 'closing'
//                 : ''
//             } scheduled in 24 hours ${getDateDifference(
//               Date.now(),
//               schedule?.scheduleDate
//             )} with ${
//               (schedule?.associatedAgent as User)?.firstName +
//               ' ' +
//               (schedule?.associatedAgent as User)?.lastName
//             }`,
//             referenceType: NotificationReferenceType.SCHEDULE,
//             referenceDoc: schedule?._id,
//             status: '',
//             createdAt: new Date(),
//           });
//           pubSub.publish('NOTIFICATIONS', notification1);
//           pubSub.publish('NOTIFICATIONS', notification2);
//           if (
//             (notification1.user as User)?.notificationSettings
//               ?.allowPushNotification &&
//             (notification1.user as User)?.notificationSettings
//               ?.allowReminderNotification
//           ) {
//             sendPushNotification([
//               {
//                 pushToken: (notification1?.user as User)?.pushToken,
//                 message: {
//                   body:
//                     (notification1?.sender as User)?.firstName +
//                     ' ' +
//                     (notification1?.sender as User)?.lastName +
//                     ' ' +
//                     notification1?.subtext,
//                   data: {
//                     type: 'schedule',
//                     data: schedule?._id,
//                   },
//                 },
//               },
//             ]);
//           }
//           if (
//             (notification2.user as User)?.notificationSettings
//               ?.allowPushNotification &&
//             (notification2.user as User)?.notificationSettings
//               ?.allowReminderNotification
//           ) {
//             sendPushNotification([
//               {
//                 pushToken: (notification2?.user as User)?.pushToken,
//                 message: {
//                   body:
//                     (notification2?.sender as User)?.firstName +
//                     ' ' +
//                     (notification2?.sender as User)?.lastName +
//                     notification2?.subtext,
//                   data: {
//                     type: 'schedule',
//                     data: schedule?._id,
//                   },
//                 },
//               },
//             ]);
//           }
//         }
//       }
//     } catch (err) {
//       console.error('Error sending notifications:', err);
//     }
//   }

//   private static async sendDropfeedbackReminder() {
//     const today = new Date();
//     const threeHrsAgo = new Date(today.setHours(today.getHours() - 3));

//     console.log(
//       `feedbackReminder Cron job executed at ${today.toLocaleDateString()} for ${threeHrsAgo.toLocaleDateString()}`
//     );
//     // Perform a MongoDB query to find notifications to send
//     try {
//       const schedulesToNotify = await ScheduleModel.find({
//         scheduleDate: {$gte: threeHrsAgo, $lte: Date.now()},
//         status: ScheduleStatus.ACCEPTED,
//         scheduleType: ScheduleType.SHOWING,
//       }).populate(['associatedAgent', 'associatedBuyer']);

//       console.log('notify', schedulesToNotify);
//       if (schedulesToNotify) {
//         // Send notifications
//         for (const schedule of schedulesToNotify) {
//           const notification = await NotificationModel.createNotification({
//             user: (schedule?.associatedBuyer as User)?._id,

//             sender: (schedule?.associatedAgent as User)?._id,
//             title: NotificationType.FEEDBACKREMINDER,

//             // subtext: `${schedule.scheduleType.toLowerCase()} schedule with ${
//             //   (schedule?.associatedAgent as User)?.firstName +
//             //   ' ' +
//             //   (schedule?.associatedAgent as User)?.lastName
//             // } is in ${getDateDifference(Date.now(), schedule?.scheduleDate)}`,
//             subtext:
//               'Help your agent find you perfect property by providing feedback on the house(s) you just veiwed!!!',
//             referenceType: NotificationReferenceType.SCHEDULE,
//             referenceDoc: schedule?._id,
//             status: '',
//             createdAt: new Date(),
//           });
//           pubSub.publish('NOTIFICATIONS', notification);
//           if (
//             (notification.user as User)?.notificationSettings
//               ?.allowPushNotification &&
//             (notification.user as User)?.notificationSettings
//               ?.allowFeedbackNotification
//           ) {
//             sendPushNotification([
//               {
//                 pushToken: (notification?.user as User)?.pushToken,
//                 message: {
//                   body:
//                     (notification?.sender as User)?.firstName +
//                     ' ' +
//                     (notification?.sender as User)?.lastName +
//                     ' ' +
//                     notification?.subtext,
//                   data: {
//                     type: 'schedule',
//                     data: schedule?._id,
//                   },
//                 },
//               },
//             ]);
//           }
//         }
//       }
//     } catch (err) {
//       console.error('Error sending notifications:', err);
//     }
//   }

//   private static async sendShowInterestAfterShowingReminder() {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);
//     console.log(
//       `Cron job executed at ${today.toLocaleDateString()} for ${yesterday.toLocaleDateString()}`
//     );

//     // Perform a MongoDB query to find notifications to send
//     try {
//       const schedulesToNotify = await ScheduleModel.find({
//         scheduleDate: {$gte: yesterday, $lte: Date.now()},
//         status: ScheduleStatus.ACCEPTED,
//         scheduleType: ScheduleType.SHOWING,
//       }).populate(['associatedAgent', 'associatedBuyer']);
//       console.log('notify', schedulesToNotify);
//       if (schedulesToNotify) {
//         for (const schedule of schedulesToNotify) {
//           const notification = await NotificationModel.createNotification({
//             user: (schedule?.associatedBuyer as User)?._id,
//             sender: (schedule?.associatedAgent as User)?._id,
//             title: NotificationType.SHOWINTERESTREMINDER,
//             subtext: ` Thank you for touring with ${
//               (schedule?.associatedAgent as User)?.firstName +
//               ' ' +
//               (schedule?.associatedAgent as User)?.lastName
//             } yesterday were there any properties of interest? would you like an estimate for a monthly payment for any or all of the properties?`,
//             referenceType: NotificationReferenceType.SCHEDULE,
//             referenceDoc: schedule?._id,
//             status: '',
//             createdAt: new Date(),
//           });
//           pubSub.publish('NOTIFICATIONS', notification);
//           if (
//             (notification.user as User)?.notificationSettings
//               ?.allowPushNotification &&
//             (notification.user as User)?.notificationSettings
//               ?.allowFeedbackNotification
//           ) {
//             sendPushNotification([
//               {
//                 pushToken: (notification?.user as User)?.pushToken,
//                 message: {
//                   body:
//                     (notification?.sender as User)?.firstName +
//                     ' ' +
//                     (notification?.sender as User)?.lastName +
//                     ' ' +
//                     notification?.subtext,
//                   data: {
//                     type: 'schedule',
//                     data: schedule?._id,
//                   },
//                 },
//               },
//             ]);
//           }
//         }
//       }
//     } catch (err) {
//       console.error('Error sending notifications:', err);
//     }
//   }

//   private static async sendCloseOfEscrowReminder() {
//     const currentTime = new Date().toLocaleTimeString();
//     console.log(`Cron job executed at ${currentTime}`);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     console.log(today);
//     const isIn5Days = new Date(today.setHours(today.getHours() + 120));
//     const tomorrow = new Date(today.setHours(today.getHours() + 48));
//     const sameDay = new Date(today.setHours(today.getHours() + 24));
//     console.log(isIn5Days, 'isIn5Days');

//     // Perform a MongoDB query to find notifications to send
//     try {
//       const contractsIn5DaysToNotify = await ContractModel.find({
//         properties: {
//           $elemMatch: {
//             escrowEndDate: {
//               $gte: today,
//               $lte: isIn5Days,
//             },
//           },
//         },
//       }).populate(['associatedAgent', 'associatedBuyer']);
//       const contractsTomorrowToNotify = await ContractModel.find({
//         properties: {
//           $elemMatch: {
//             escrowEndDate: {
//               $gte: today,
//               $lte: tomorrow,
//             },
//           },
//         },
//       }).populate(['associatedAgent', 'associatedBuyer']);
//       const contractsTodayToNotify = await ContractModel.find({
//         properties: {
//           $elemMatch: {
//             escrowEndDate: {
//               $gte: today,
//               $lte: sameDay,
//             },
//           },
//         },
//       }).populate(['associatedAgent', 'associatedBuyer']);

//       console.log('notify', contractsIn5DaysToNotify);
//       if (contractsIn5DaysToNotify) {
//         // Send notifications
//         for (const contract of contractsIn5DaysToNotify) {
//           const notification1 = await NotificationModel.createNotification({
//             user: (contract?.associatedAgent as User)?._id,
//             sender: (contract?.associatedBuyer as User)?._id,
//             title: NotificationType.CLOSEOFESCROW,
//             subtext: ` ${
//               (contract?.associatedBuyer as User)?.firstName +
//               ' ' +
//               (contract?.associatedBuyer as User)?.lastName
//             } is closing escrow in few days`,
//             referenceType: NotificationReferenceType.CONTRACT,
//             referenceDoc: contract?._id,
//             status: '',
//             createdAt: new Date(),
//           });
//           const notification2 = await NotificationModel.createNotification({
//             user: (contract?.associatedBuyer as User)?._id,
//             sender: (contract?.associatedAgent as User)?._id,
//             title: NotificationType.CLOSEOFESCROW,
//             subtext:
//               "Your closing is quickly approaching, it's time to schedule your final walk through and confirm all agreed repairs have been completed, and the property is in the condition it was in at time of offer",
//             referenceType: NotificationReferenceType.CONTRACT,
//             referenceDoc: contract?._id,
//             status: '',
//             createdAt: new Date(),
//           });
//           pubSub.publish('NOTIFICATIONS', notification1);
//           pubSub.publish('NOTIFICATIONS', notification2);
//           if (
//             (notification1.user as User)?.notificationSettings
//               ?.allowPushNotification &&
//             (notification1.user as User)?.notificationSettings
//               ?.allowReminderNotification
//           ) {
//             sendPushNotification([
//               {
//                 pushToken: (notification1?.user as User)?.pushToken,
//                 message: {
//                   body:
//                     (notification1?.sender as User)?.firstName +
//                     ' ' +
//                     (notification1?.sender as User)?.lastName +
//                     ' ' +
//                     notification1?.subtext,
//                   data: {
//                     type: 'contract',
//                     data: contract?._id,
//                   },
//                 },
//               },
//             ]);
//           }
//           if (
//             (notification2.user as User)?.notificationSettings
//               ?.allowPushNotification &&
//             (notification2.user as User)?.notificationSettings
//               ?.allowReminderNotification
//           ) {
//             sendPushNotification([
//               {
//                 pushToken: (notification2?.user as User)?.pushToken,
//                 message: {
//                   body:
//                     (notification2?.sender as User)?.firstName +
//                     ' ' +
//                     (notification2?.sender as User)?.lastName +
//                     notification2?.subtext,
//                   data: {
//                     type: 'contract',
//                     data: contract?._id,
//                   },
//                 },
//               },
//             ]);
//           }
//         }
//       }
//       if (contractsTomorrowToNotify) {
//         // Send notifications
//         for (const contract of contractsTomorrowToNotify) {
//           const notification1 = await NotificationModel.createNotification({
//             user: (contract?.associatedAgent as User)?._id,
//             sender: (contract?.associatedBuyer as User)?._id,
//             title: NotificationType.CLOSEOFESCROW,
//             subtext: ` ${
//               (contract?.associatedBuyer as User)?.firstName +
//               ' ' +
//               (contract?.associatedBuyer as User)?.lastName
//             } is closing escrow tommorrow`,
//             referenceType: NotificationReferenceType.CONTRACT,
//             referenceDoc: contract?._id,
//             status: '',
//             createdAt: new Date(),
//           });
//           const notification2 = await NotificationModel.createNotification({
//             user: (contract?.associatedBuyer as User)?._id,
//             sender: (contract?.associatedAgent as User)?._id,
//             title: NotificationType.CLOSEOFESCROW,
//             subtext:
//               'Congratulations you are closing on your property tomorrow',
//             referenceType: NotificationReferenceType.CONTRACT,
//             referenceDoc: contract?._id,
//             status: '',
//             createdAt: new Date(),
//           });
//           pubSub.publish('NOTIFICATIONS', notification1);
//           pubSub.publish('NOTIFICATIONS', notification2);
//           if (
//             (notification1.user as User)?.notificationSettings
//               ?.allowPushNotification &&
//             (notification1.user as User)?.notificationSettings
//               ?.allowReminderNotification
//           ) {
//             sendPushNotification([
//               {
//                 pushToken: (notification1?.user as User)?.pushToken,
//                 message: {
//                   body:
//                     (notification1?.sender as User)?.firstName +
//                     ' ' +
//                     (notification1?.sender as User)?.lastName +
//                     ' ' +
//                     notification1?.subtext,
//                   data: {
//                     type: 'contract',
//                     data: contract?._id,
//                   },
//                 },
//               },
//             ]);
//           }
//           if (
//             (notification2.user as User)?.notificationSettings
//               ?.allowPushNotification &&
//             (notification2.user as User)?.notificationSettings
//               ?.allowReminderNotification
//           ) {
//             sendPushNotification([
//               {
//                 pushToken: (notification2?.user as User)?.pushToken,
//                 message: {
//                   body:
//                     (notification2?.sender as User)?.firstName +
//                     ' ' +
//                     (notification2?.sender as User)?.lastName +
//                     notification2?.subtext,
//                   data: {
//                     type: 'contract',
//                     data: contract?._id,
//                   },
//                 },
//               },
//             ]);
//           }
//         }
//       }
//       if (contractsTodayToNotify) {
//         // Send notifications
//         for (const contract of contractsTomorrowToNotify) {
//           const notification1 = await NotificationModel.createNotification({
//             user: (contract?.associatedAgent as User)?._id,
//             sender: (contract?.associatedBuyer as User)?._id,
//             title: NotificationType.CLOSEOFESCROW,
//             subtext: ` ${
//               (contract?.associatedBuyer as User)?.firstName +
//               ' ' +
//               (contract?.associatedBuyer as User)?.lastName
//             } is closing escrow today`,
//             referenceType: NotificationReferenceType.CONTRACT,
//             referenceDoc: contract?._id,
//             status: '',
//             createdAt: new Date(),
//           });
//           const notification2 = await NotificationModel.createNotification({
//             user: (contract?.associatedBuyer as User)?._id,
//             sender: (contract?.associatedAgent as User)?._id,
//             title: NotificationType.CLOSEOFESCROW,
//             subtext: 'Happy Closing Day!!!',
//             referenceType: NotificationReferenceType.CONTRACT,
//             referenceDoc: contract?._id,
//             status: '',
//             createdAt: new Date(),
//           });

//           pubSub.publish('NOTIFICATIONS', notification1);
//           pubSub.publish('NOTIFICATIONS', notification2);
//           if (
//             (notification1.user as User)?.notificationSettings
//               ?.allowPushNotification &&
//             (notification1.user as User)?.notificationSettings
//               ?.allowReminderNotification
//           ) {
//             sendPushNotification([
//               {
//                 pushToken: (notification1?.user as User)?.pushToken,
//                 message: {
//                   body:
//                     (notification1?.sender as User)?.firstName +
//                     ' ' +
//                     (notification1?.sender as User)?.lastName +
//                     ' ' +
//                     notification1?.subtext,
//                   data: {
//                     type: 'contract',
//                     data: contract?._id,
//                   },
//                 },
//               },
//             ]);
//           }
//           if (
//             (notification2.user as User)?.notificationSettings
//               ?.allowPushNotification &&
//             (notification2.user as User)?.notificationSettings
//               ?.allowReminderNotification
//           ) {
//             sendPushNotification([
//               {
//                 pushToken: (notification2?.user as User)?.pushToken,
//                 message: {
//                   body:
//                     (notification2?.sender as User)?.firstName +
//                     ' ' +
//                     (notification2?.sender as User)?.lastName +
//                     notification2?.subtext,
//                   data: {
//                     type: 'contract',
//                     data: contract?._id,
//                   },
//                 },
//               },
//             ]);
//           }
//         }
//       }
//     } catch (err) {
//       console.error('Error sending notifications:', err);
//     }
//   }
//   private static async sendInspectionPeriodEndingReminder() {
//     const currentTime = new Date().toLocaleTimeString();
//     console.log(`Cron job executed at ${currentTime}`);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     console.log(today);
//     const isIn5Days = new Date(today.setHours(today.getHours() + 120));
//     const tomorrow = new Date(today.setHours(today.getHours() + 48));
//     const sameDay = new Date(today.setHours(today.getHours() + 24));
//     console.log(isIn5Days, 'isIn5Days');

//     // Perform a MongoDB query to find notifications to send
//     try {
//       const contractsIn5DaysToNotify = await ContractModel.find({
//         properties: {
//           $elemMatch: {
//             inspectionEndDate: {
//               $gte: today,
//               $lte: isIn5Days,
//             },
//           },
//         },
//       }).populate(['associatedAgent', 'associatedBuyer']);
//       const contractsTomorrowToNotify = await ContractModel.find({
//         properties: {
//           $elemMatch: {
//             inspectionEndDate: {
//               $gte: today,
//               $lte: tomorrow,
//             },
//           },
//         },
//       }).populate(['associatedAgent', 'associatedBuyer']);
//       const contractsTodayToNotify = await ContractModel.find({
//         properties: {
//           $elemMatch: {
//             inspectionEndDate: {
//               $gte: today,
//               $lte: sameDay,
//             },
//           },
//         },
//       }).populate(['associatedAgent', 'associatedBuyer']);

//       console.log('notify', contractsIn5DaysToNotify);
//       if (contractsIn5DaysToNotify) {
//         // Send notifications
//         for (const contract of contractsIn5DaysToNotify) {
//           const notification = await NotificationModel.createNotification({
//             user: (contract?.associatedAgent as User)?._id,
//             sender: (contract?.associatedBuyer as User)?._id,
//             title: NotificationType.CLOSEOFESCROW,
//             subtext: ` ${
//               (contract?.associatedBuyer as User)?.firstName +
//               ' ' +
//               (contract?.associatedBuyer as User)?.lastName
//             }'s inspection period ends in few days,
//               contract?.scheduleDate
//             )} `,
//             referenceType: NotificationReferenceType.CONTRACT,
//             referenceDoc: contract?._id,
//             status: '',
//             createdAt: new Date(),
//           });

//           pubSub.publish('NOTIFICATIONS', notification);
//           if (
//             (notification.user as User)?.notificationSettings
//               ?.allowPushNotification &&
//             (notification.user as User)?.notificationSettings
//               ?.allowReminderNotification
//           ) {
//             sendPushNotification([
//               {
//                 pushToken: (notification?.user as User)?.pushToken,
//                 message: {
//                   body:
//                     (notification?.sender as User)?.firstName +
//                     ' ' +
//                     (notification?.sender as User)?.lastName +
//                     ' ' +
//                     notification?.subtext,
//                   data: {
//                     type: 'contract',
//                     data: contract?._id,
//                   },
//                 },
//               },
//             ]);
//           }
//         }
//       }
//       if (contractsTomorrowToNotify) {
//         // Send notifications
//         for (const contract of contractsTomorrowToNotify) {
//           const notification = await NotificationModel.createNotification({
//             user: (contract?.associatedAgent as User)?._id,
//             sender: (contract?.associatedBuyer as User)?._id,
//             title: NotificationType.CLOSEOFESCROW,
//             subtext: ` ${
//               (contract?.associatedBuyer as User)?.firstName +
//               ' ' +
//               (contract?.associatedBuyer as User)?.lastName
//             }'s inspection period ends tomorrow`,
//             referenceType: NotificationReferenceType.CONTRACT,
//             referenceDoc: contract?._id,
//             status: '',
//             createdAt: new Date(),
//           });
//           pubSub.publish('NOTIFICATIONS', notification);
//           if (
//             (notification.user as User)?.notificationSettings
//               ?.allowPushNotification &&
//             (notification.user as User)?.notificationSettings
//               ?.allowReminderNotification
//           ) {
//             sendPushNotification([
//               {
//                 pushToken: (notification?.user as User)?.pushToken,
//                 message: {
//                   body:
//                     (notification?.sender as User)?.firstName +
//                     ' ' +
//                     (notification?.sender as User)?.lastName +
//                     ' ' +
//                     notification?.subtext,
//                   data: {
//                     type: 'contract',
//                     data: contract?._id,
//                   },
//                 },
//               },
//             ]);
//           }
//         }
//       }
//       if (contractsTodayToNotify) {
//         // Send notifications
//         for (const contract of contractsTomorrowToNotify) {
//           const notification = await NotificationModel.createNotification({
//             user: (contract?.associatedAgent as User)?._id,
//             sender: (contract?.associatedBuyer as User)?._id,
//             title: NotificationType.CLOSEOFESCROW,
//             subtext: ` ${
//               (contract?.associatedBuyer as User)?.firstName +
//               ' ' +
//               (contract?.associatedBuyer as User)?.lastName
//             }'s inspection period ends today`,
//             referenceType: NotificationReferenceType.CONTRACT,
//             referenceDoc: contract?._id,
//             status: '',
//             createdAt: new Date(),
//           });

//           pubSub.publish('NOTIFICATIONS', notification);
//           if (
//             (notification.user as User)?.notificationSettings
//               ?.allowPushNotification &&
//             (notification.user as User)?.notificationSettings
//               ?.allowReminderNotification
//           ) {
//             sendPushNotification([
//               {
//                 pushToken: (notification?.user as User)?.pushToken,
//                 message: {
//                   body:
//                     (notification?.sender as User)?.firstName +
//                     ' ' +
//                     (notification?.sender as User)?.lastName +
//                     ' ' +
//                     notification?.subtext,
//                   data: {
//                     type: 'contract',
//                     data: contract?._id,
//                   },
//                 },
//               },
//             ]);
//           }
//         }
//       }
//     } catch (err) {
//       console.error('Error sending notifications:', err);
//     }
//   }
// }
