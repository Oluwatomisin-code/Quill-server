import {GraphQLError} from 'graphql';

import {getModelForClass, ReturnModelType} from '@typegoose/typegoose';
import Project from '../project.schema';
import User from '../../../users/models/users.schema';

export const getUserSubscription = async (
  ProjectModel: ReturnModelType<typeof Project>,
  userId: string
) => {
  const UserModel = getModelForClass(User);
  // Fetch the user from the database by userId
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new GraphQLError('User not found');
  }

  // Get the user's current subscription plan
  const subscriptionPlan = user.subscriptionPlan;

  // Calculate the start and end of the current month
  const startOfMonth = new Date();
  startOfMonth.setDate(1); // First day of the current month
  startOfMonth.setHours(0, 0, 0, 0); // Set time to the start of the day

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(startOfMonth.getMonth() + 1); // Move to the next month
  endOfMonth.setHours(0, 0, 0, 0); // Set time to the start of the day

  // Get the number of projects created by the user this month
  const projectCountThisMonth = await ProjectModel.countDocuments({
    associatedClient: userId,
    createdAt: {$gte: startOfMonth, $lt: endOfMonth},
  });

  // Return the result
  return {
    subscriptionPlan,
    projectCountThisMonth,
  };
};
