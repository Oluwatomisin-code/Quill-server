/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
import {Service} from 'typedi';
import ClientResponse from '../../utilities/response';
import {GraphQLError} from 'graphql';
import {
  deleteContractInput,
  CreateProjectInput,
  assignDesignerInput,
  addProjectFileInput,
} from '../dto/inputs/projects.input';
import ProjectModel from '../models/project.model';
import NotificationModel from '../../Notification/models/notification.model';
import {
  NotificationReferenceType,
  NotificationType,
} from '../../Notification/models/notification.schema';

import User from 'users/models/users.schema';
import {ProjectType} from '../../projects/models/project.schema';

@Service()
export class ContractsService {
  constructor() {}

  async createProject(input: CreateProjectInput & {clientId: string}) {
    try {
      const project =
        input.projectType === ProjectType.SOCIALMEDIA
          ? await ProjectModel.createSMProject(
              input as CreateProjectInput & {clientId: string}
            )
          : await ProjectModel.createUIProject(
              input as CreateProjectInput & {clientId: string}
            );
      await NotificationModel.createNotificationForAdmin({
        // user: null,
        sender: input.clientId,
        title: NotificationType.PROJECTCREATED,
        subtext: `A Project was created by ${
          (project?.associatedClient as User)?.fullName
        } please assign to a designer`,
        referenceType: NotificationReferenceType.PROJECT,
        referenceDoc: project?._id as string,
        status: '',
        createdAt: new Date(),
      });

      return new ClientResponse(201, true, 'done', project);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async countProjectsThisMonth(userId: string) {
    try {
      const count = await ProjectModel.countProjectsThisMonth(userId);
      console.log(count, 'hey');

      return new ClientResponse(201, true, 'done', count);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async getUserSubscription(userId: string) {
    try {
      const sub = await ProjectModel.getUserSubscription(userId);
      console.log(sub, 'hey');

      return new ClientResponse(201, true, 'done', sub);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async assignDesignerToProject(
    input: assignDesignerInput & {adminId: string}
  ) {
    try {
      const project = await ProjectModel.assignDesignerToProject(input);

      // const notification = await NotificationModel.createNotification({
      //   user: input.designerId,
      //   sender: input.adminId,
      //   title: NotificationType.PROJECT_ASSIGNED,
      //   subtext: `A Project has been assigned to a designer`,
      //   referenceType: NotificationReferenceType.PROJECT,
      //   referenceDoc: project?._id as string,
      //   status: '',
      //   createdAt: new Date(),
      // });
      return new ClientResponse(201, true, 'done', project);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async getProjectById(input: {id: string}) {
    try {
      const project = await ProjectModel.getProjectById(input);
      return new ClientResponse(201, true, 'done', project);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async getAllProjects() {
    try {
      const contracts = await ProjectModel.getAllProjects();
      return new ClientResponse(201, true, 'done', contracts);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }
  async addProjectFile(input: addProjectFileInput) {
    try {
      const project = await ProjectModel.addProjectFile(input);
      return new ClientResponse(201, true, 'done', project);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async getAssociatedProjects({userId, role}: {userId: string; role: string}) {
    try {
      const contracts = await ProjectModel.getAssociatedProjects({
        userId,
        role,
      });
      return new ClientResponse(201, true, 'done', contracts);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }
  async getProjectsByUserId({userId, role}: {userId: string; role: string}) {
    try {
      const projects = await ProjectModel.getProjectsByUserId({
        userId,
        role,
      });
      return new ClientResponse(201, true, 'done', projects);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async deleteContract(input: deleteContractInput) {
    try {
      const delContract = await ProjectModel.deleteCompany(input);
      return new ClientResponse(201, true, 'done', delContract);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }
}
