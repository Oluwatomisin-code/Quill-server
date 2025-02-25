import {
  ApplicationResponse,
  VersionResponse,
} from '../dto/returnTypes/application.returnTypes';
import {ApplicationService} from '../services/application.services';
import {Mutation, Query, Resolver} from 'type-graphql';
import {Service} from 'typedi';

@Service()
@Resolver()
export default class ApplicationResolver {
  constructor(private readonly applicationService: ApplicationService) {}

  @Mutation(() => ApplicationResponse)
  async updateApiCount() {
    return this?.applicationService?.updateApiCount();
  }
  @Query(() => VersionResponse)
  async getVersion() {
    return this?.applicationService?.getVersion();
  }
  @Query(() => ApplicationResponse)
  async getApplication() {
    return this?.applicationService?.getApplication();
  }
}
