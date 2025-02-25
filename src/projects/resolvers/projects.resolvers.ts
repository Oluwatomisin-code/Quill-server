/* eslint-disable no-empty-function */
import {
  Arg,
  Authorized,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
} from 'type-graphql';
import {Service} from 'typedi';
import {
  addProjectFileInput,
  assignDesignerInput,
  CreateProjectInput,
  deleteContractInput,
  editCompanyInput,
  getContractByUserIdInput,
  getProjectByIdInput,
  getProjectsByUserIdInput,
} from '../dto/inputs/projects.input';
import User, {UserRole} from '../../users/models/users.schema';
import {ContractsService} from '../services/projects.service';
import {
  ContractResponse,
  ContractsResponse,
  CountResponse,
} from '../dto/returnTypes/contracts.returnTypes';

@Service()
@Resolver()
export default class ProjectsResolver {
  constructor(private readonly contractsService: ContractsService) {}

  @Authorized([UserRole.CLIENT])
  @Mutation(() => ContractResponse)
  async createProject(
    @Arg('createProjectInput') input: CreateProjectInput,
    @Ctx('getUser') getUser: () => User,
    @PubSub() pubSub: PubSubEngine
  ) {
    pubSub.publish('NOTIFICATIONS', 'class');
    const clientId = getUser()._id;
    const edited = this.contractsService.createProject({...input, clientId});
    pubSub.publish('NOTIFICATIONS', 'name');
    return edited;
  }

  @Authorized([UserRole.CLIENT])
  @Query(() => CountResponse)
  async countProjectsThisMonth(
    @Ctx('getUser') getUser: () => User,
    @PubSub() pubSub: PubSubEngine
  ) {
    const userId = getUser()._id;
    const count = this.contractsService.countProjectsThisMonth(userId);

    return count;
  }

  @Authorized([UserRole.CLIENT])
  @Query(() => CountResponse)
  async getUserSubscription(
    @Ctx('getUser') getUser: () => User,
    @PubSub() pubSub: PubSubEngine
  ) {
    const userId = getUser()._id;
    const count = this.contractsService.getUserSubscription(userId);

    return count;
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => ContractResponse)
  async assignDesignerToProject(
    @Arg('AssignDesignerInput') input: assignDesignerInput,
    @Ctx('getUser') getUser: () => User,
    @PubSub() pubSub: PubSubEngine
  ) {
    const adminId = getUser()?._id;
    console.log(adminId);
    const project = this.contractsService.assignDesignerToProject({
      ...input,
      adminId: adminId,
    });

    return project;
  }

  @Authorized([UserRole.ADMIN, UserRole.CLIENT, UserRole.LANCER])
  @Query(() => ContractResponse)
  async getProjectById(@Arg('input') input: getProjectByIdInput) {
    const edited = this.contractsService.getProjectById({...input});

    return edited;
  }

  @Authorized([UserRole.CLIENT, UserRole.LANCER, UserRole.ADMIN])
  @Query(() => ContractsResponse)
  async getAssociatedProjects(
    @Ctx('getUser')
    getUser: () => User
  ) {
    return this.contractsService.getAssociatedProjects({
      userId: getUser()._id,
      role: getUser().role,
    });
  }

  @Authorized([UserRole.CLIENT, UserRole.LANCER, UserRole.ADMIN])
  @Query(() => ContractsResponse)
  async getProjectsByUserId(
    @Arg('input')
    input: getProjectsByUserIdInput
  ) {
    return this.contractsService.getProjectsByUserId({
      userId: input.userId,
      role: input.role,
    });
  }

  @Authorized([UserRole.ADMIN])
  @Query(() => ContractsResponse)
  async getAllProjects(
    @Ctx('getUser')
    getUser: () => User
  ) {
    return this.contractsService.getAllProjects();
  }

  @Mutation(() => ContractResponse)
  async addProjectFile(@Arg('input') input: addProjectFileInput) {
    return this.contractsService.addProjectFile(input);
  }

  @Authorized([UserRole.CLIENT, UserRole.ADMIN])
  @Mutation(() => ContractResponse)
  async deleteContract(@Arg('input') input: deleteContractInput) {
    // console.log(input);
    return this.contractsService.deleteContract(input);
  }
}
