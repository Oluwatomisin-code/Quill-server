/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
import {Service} from 'typedi';
import {Response} from 'express';
import UserModel from '../../users/models/users.model';
import ClientResponse from '../../utilities/response';
import {GraphQLError} from 'graphql';
import {
  updateResetPasswordInput,
  changePasswordInput,
  CreateUserInput,
  LoginInput,
  verifyInput,
  resendOtpInput,
  // addBuyerInput,
} from '../../users/dto/inputs/user.input';

@Service()
export class UserAuthService {
  constructor() {}

  async register(input: CreateUserInput) {
    try {
      const user = await UserModel.createUser(input);
      console.log(user);
      return new ClientResponse(201, true, 'done', user);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async login(input: LoginInput) {
    try {
      const user = await UserModel.login(input);
      return new ClientResponse(201, true, 'done', user);
    } catch (error) {
      console.log(error, 'login error');
      // throw new GraphQLError(error);
      return new ClientResponse(401, false, error.message, null);
    }
  }
  async verifyEmail(input: verifyInput) {
    try {
      const user = await UserModel.verifyEmail(input);
      console.log(user, 'user');
      return new ClientResponse(201, true, 'done', user);
    } catch (error) {
      return new ClientResponse(401, false, error.message, null);
    }
  }

  async updateResetPassword(input: updateResetPasswordInput) {
    try {
      const user = await UserModel.updateResetPassword(input);
      return new ClientResponse(201, true, 'done', user);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async changePassword(input: changePasswordInput) {
    try {
      const result = await UserModel.changePassword(input);
      return result;
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await UserModel.forgotPassword(email);
      return new ClientResponse(201, true, 'done', user);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async resendOtp(input: resendOtpInput) {
    try {
      const user = await UserModel.resendOtp(input);
      return new ClientResponse(201, true, 'done', user);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async getUser(userId: string) {
    try {
      const user = await UserModel.getUser(userId);
      return new ClientResponse(201, true, 'done', user);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  static async oAuthCallback(req: any, res: Response) {
    const domain = req.session.domain;
    try {
      res.redirect(`${domain}/dashboard`);
    } catch (error) {
      console.log('oAuthCallbackError', error);
      res.redirect(`${domain}auth/signin`);
    }
  }
}
