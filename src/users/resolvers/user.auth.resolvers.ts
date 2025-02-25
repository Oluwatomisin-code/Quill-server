/* eslint-disable no-empty-function */
import {Arg, Authorized, Ctx, Mutation, Query, Resolver} from 'type-graphql';
import {Service} from 'typedi';
import {
  LoginInput,
  updateResetPasswordInput,
  changePasswordInput,
  verifyInput,
  resendOtpInput,
} from '../dto/inputs/user.input';
import User from '../models/users.schema';
import ClientResponse from '../../utilities/response';
import {UserAuthService} from '../../users/services/user.auth.service';
import {UserResponse} from '../dto/returnTypes/user.returnTypes';
import {CreateUserInput} from '../dto/inputs/user.input';

@Service()
@Resolver()
export default class UserResolver {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Mutation(() => UserResponse)
  async createUser(@Arg('CreateUserInput') input: CreateUserInput) {
    return this.userAuthService.register(input);
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('loginInput') {email, password}: LoginInput,
    @Ctx('authenticate')
    authenticate: (
      strategy: string,
      credentails: {email: string; password: string}
    ) => PromiseLike<{user: User}> | {user: User},
    @Ctx('login')
    login: (user: User) => User
  ) {
    const {user} = await authenticate('graphql-local', {email, password});
    login(user);
    return new ClientResponse(201, true, 'done', user);
  }

  @Mutation(() => UserResponse)
  async verifyEmail(@Arg('verifyInput') input: verifyInput) {
    return this.userAuthService.verifyEmail(input);
  }

  @Mutation(() => UserResponse)
  async forgotPassword(@Arg('email') email: string) {
    return this.userAuthService.forgotPassword(email);
  }

  @Mutation(() => UserResponse)
  async updateResetPassword(
    @Arg('updateResetPasswordInput') input: updateResetPasswordInput
  ) {
    return this.userAuthService.updateResetPassword(input);
  }

  @Mutation(() => Boolean)
  async changePassword(@Arg('input') input: changePasswordInput) {
    return this.userAuthService.changePassword(input);
  }

  @Mutation(() => UserResponse)
  async resendOtp(@Arg('resendOtpInput') input: resendOtpInput) {
    return this.userAuthService.resendOtp(input);
  }

  @Authorized()
  @Query(() => UserResponse)
  async getUser(
    @Ctx('getUser')
    getUser: () => User
  ) {
    return this.userAuthService.getUser(getUser()._id);
  }

  @Mutation(() => UserResponse)
  async logout(
    @Ctx('logout')
    logout: () => void,
    @Ctx('req')
    req: any
  ) {
    try {
      req.user = null;
      logout();
      req.logout(function (err: any) {
        console.log(err);
      });
      req.session.destroy(() => null);
      return new ClientResponse(200, true, 'successful', null);
    } catch (error) {
      return new ClientResponse(401, false, error.message, null);
    }
  }
}

// How much valuable knowledge do you possess to help you achieve your financial aspirations?
