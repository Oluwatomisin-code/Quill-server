import {getModelForClass, ReturnModelType} from '@typegoose/typegoose';
import {GraphQLError} from 'graphql';
import Project, {ProjectType} from '../project.schema';
import {CreateProjectInput} from '../../../projects/dto/inputs/projects.input';
import User from '../../../users/models/users.schema';

export default async function createSMProject(
  ProjectModel: ReturnModelType<typeof Project>,
  input: CreateProjectInput & {clientId: string}
) {
  const UserModel = getModelForClass(User);
  // Fetch the user
  const user = await UserModel.findById(input.clientId);

  if (!user) {
    throw new Error('User not found');
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
        'You have reached the project creation limit for this month.'
      );
    }
  }

  try {
    return await new ProjectModel({
      projectType: ProjectType.SOCIALMEDIA,
      associatedClient: input.clientId,
      associatedDesigner: null,
      details: {
        brandName: input.brandName,
        smCategory: input.smCategory,
        smPerWeek: input.smPerWeek,
        smDesignPlan: input.smDesignPlan,
        additionalInfo: input.additionalInfo,
        brandindMaterialsUrl: input.brandingMaterialsUrl,
      },
    }).save();
  } catch (error) {
    throw new GraphQLError(error);
  }
}
