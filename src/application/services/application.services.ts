import ApplicationModel from '../models/application.model';
import {GraphQLError} from 'graphql';
import {Service} from 'typedi';
import ClientResponse from '../../utilities/response';

@Service()
export class ApplicationService {
  constructor() {}
  async updateApiCount() {
    try {
      const ApiCount = await ApplicationModel.updateApiCount();
      return new ClientResponse(201, true, 'done', ApiCount);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }
  async getVersion() {
    try {
      //   await this.createApplication();
      const version = await ApplicationModel.getVersion();
      return new ClientResponse(201, true, 'done', version);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }
  async getApplication() {
    try {
      //   await ApplicationModel.createApplication();
      const application = await ApplicationModel.getApplication();
      return new ClientResponse(201, true, 'done', application);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async createApplication() {
    try {
      await this.createApplication();
    } catch (error) {
      throw new GraphQLError(error);
    }
  }
}
