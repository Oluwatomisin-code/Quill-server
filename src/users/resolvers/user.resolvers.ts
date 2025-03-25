/* eslint-disable prettier/prettier */
/* eslint-disable no-empty-function */
import {Arg, Authorized, Ctx, Mutation, Query, Resolver} from 'type-graphql';
import {Service} from 'typedi';
import {
  EditUserInput,
  inviteAdminInput,
  inviteLancerInput,
} from '../dto/inputs/user.input';
import {UserService} from '../../users/services/user.service';
import User, {UserRole} from '../../users/models/users.schema';
import {
  FileUploadResponse,
  UserResponse,
  UsersResponse,
} from '../../users/dto/returnTypes/user.returnTypes';
import {UserAuthService} from '../../users/services/user.auth.service';
import {FileUpload, GraphQLUpload} from 'graphql-upload';

@Service()
@Resolver()
export default class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly userAuthService: UserAuthService
  ) {}

  @Authorized([UserRole.CLIENT, UserRole.LANCER, UserRole.ADMIN])
  @Mutation(() => UserResponse)
  async editUser(
    @Arg('input') input: EditUserInput,
    @Ctx('getUser') getUser: () => User
  ) {
    const userId = getUser()._id;
    return this.userService.editUser({...input, userId});
  }

  @Authorized([UserRole.CLIENT, UserRole.LANCER, UserRole.ADMIN])
  @Mutation(() => UserResponse)
  async uploadImage(
    @Arg('file', () => GraphQLUpload)
    {createReadStream, mimetype}: FileUpload,
    @Ctx('getUser') getUser: () => User
  ) {
    const user = getUser();

    return await this.userService.uploadImage(
      {email: user.email, profileImg: user.profileImg, userId: user._id},
      createReadStream,
      mimetype
    );
  }

  @Authorized([UserRole.CLIENT, UserRole.LANCER, UserRole.ADMIN])
  @Mutation(() => FileUploadResponse)
  async uploadFile(
    @Arg('file', () => GraphQLUpload)
    {createReadStream, mimetype, filename}: FileUpload,
    @Ctx('getUser') getUser: () => User
  ) {
    const user = getUser();

    return await this.userService.uploadFile(
      {userId: user._id},
      createReadStream,
      mimetype,
      filename
    );
  }

  @Authorized([UserRole.ADMIN, UserRole.LANCER])
  @Query(() => UsersResponse)
  async getClients(@Ctx('getUser') getUser: () => User) {
    let input = {
      _id: getUser()._id,
      role: getUser().role,
    };

    return this.userService.getClients(input);
  }

  @Authorized([UserRole.ADMIN, UserRole.CLIENT])
  @Query(() => UsersResponse)
  async getLancers(@Ctx('getUser') getUser: () => User) {
    let input = {
      _id: getUser()._id,
      role: getUser().role,
    };

    return this.userService.getLancers(input);
  }

  @Authorized([UserRole.CLIENT, UserRole.LANCER])
  @Query(() => UsersResponse)
  async getMessageableUsers(@Ctx('getUser') getUser: () => User) {
    let input = {
      _id: getUser()._id,
      role: getUser().role,
    };

    return this.userService.getMessageableUsers(input);
  }

  @Authorized([UserRole.ADMIN])
  @Query(() => UsersResponse)
  async getAllUsers(@Ctx('getUser') getUser: () => User) {
    let input = {
      _id: getUser()._id,
      role: getUser()._id,
    };
    return this.userService.getAllUsers(input);
  }

  @Authorized([UserRole.CLIENT, UserRole.LANCER, UserRole.ADMIN])
  @Query(() => UserResponse)
  async getUserById(@Arg('userId') userId: string) {
    return this.userAuthService.getUser(userId);
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => UserResponse)
  async inviteDesigner(@Arg('input') input: inviteLancerInput) {
    return this.userService.inviteDesigner(input);
  }

  @Authorized([UserRole.ADMIN])
  @Mutation(() => UserResponse)
  async inviteAdmin(@Arg('input') input: inviteAdminInput) {
    return this.userService.inviteAdmin(input);
  }
}
