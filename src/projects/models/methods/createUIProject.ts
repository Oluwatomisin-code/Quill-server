import {getModelForClass, ReturnModelType} from '@typegoose/typegoose';
import {GraphQLError} from 'graphql';

import Project, {ProjectType} from '../project.schema';
import {CreateProjectInput} from '../../../projects/dto/inputs/projects.input';
// import UserModel from '../../../users/models/users.model';
import User, {SubscriptionPlan} from '../../../users/models/users.schema';

export default async function createUIProject(
  ProjectModel: ReturnModelType<typeof Project>,
  input: CreateProjectInput & {clientId: string}
) {
  const UserModel = getModelForClass(User);
  // Fetch the user
  const user = await UserModel.findById(input.clientId);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.subscriptionPlan === SubscriptionPlan.NIL) {
    throw new Error(
      'You have reached the project creation limit for this month. Please Upgrade'
    );
  }

  // Check if the user is on the "STARTER" plan
  if (user.subscriptionPlan === 'STARTER') {
    // Get the number of projects the user has created this month
    const projectCount = await ProjectModel.countProjectsThisMonth(
      input.clientId
    );

    // If they have 10 or more projects, restrict further creation
    if (projectCount.projectCountThisMonth >= 10) {
      throw new Error(
        'You have reached the project creation limit for this month. Please Upgrade'
      );
    }
  }
  // Check if the user is on the "STARTER" plan
  if (user.subscriptionPlan === SubscriptionPlan.PREMIUM) {
    // Get the number of projects the user has created this month
    const projectCount = await ProjectModel.countProjectsThisMonth(
      input.clientId
    );

    // If they have 10 or more projects, restrict further creation
    if (projectCount.projectCountThisMonth >= 20) {
      throw new Error(
        'You have reached the project creation limit for this month. Please Upgrade'
      );
    }
  }

  try {
    return await new ProjectModel({
      projectType: ProjectType.UI,
      associatedClient: input.clientId,
      associatedDesigner: null,
      details: {
        productName: input.productName,
        productCategory: input.productCategory,
        productType: input.productType,
        aboutProduct: input.aboutProduct,
        additiobrandingAlreadynalInfo: input.brandingAlready,
        productFunctionalities: input.productFunctionalities,
      },
    }).save();
  } catch (error) {
    throw new GraphQLError(error);
  }
}
