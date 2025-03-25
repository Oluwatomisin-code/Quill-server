/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-empty-function */
import {Service} from 'typedi';
import UserModel from '../../users/models/users.model';
import ClientResponse from '../../utilities/response';
import {GraphQLError} from 'graphql';
import {
  EditBuyerStatusInput,
  EditUserInput,
  inviteAdminInput,
  inviteLancerInput,

  // updateNotificationSettingInput,
  // updateSecuritySettingInput,
  usersFilterInput,
} from '../../users/dto/inputs/user.input';
import {createUploadStream, deleteImage} from '../../utilities/s3/upload';

@Service()
export class UserService {
  constructor() {}

  async getClients(input: usersFilterInput) {
    try {
      const users = await UserModel.getClients(input);
      return new ClientResponse(201, true, 'done', users);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }
  async getLancers(input: usersFilterInput) {
    try {
      const users = await UserModel.getLancers(input);
      return new ClientResponse(201, true, 'done', users);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async getMessageableUsers(input: usersFilterInput) {
    try {
      const users = await UserModel.getMessageableUsers(input);
      return new ClientResponse(201, true, 'done', users);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async getAllUsers(input: usersFilterInput) {
    try {
      const users = await UserModel.getAllUsers(input);
      return new ClientResponse(201, true, 'done', users);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async editUser(input: EditUserInput & {userId: string}) {
    try {
      const updatedUser = await UserModel.editUser(input);
      return new ClientResponse(201, true, 'done', updatedUser);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async editBuyerStatus(input: EditBuyerStatusInput & {userId: string}) {
    try {
      const user = await UserModel.getUser(input.userId);
      if (user) {
        const updatedUser = await UserModel.editUser({
          ...input,
          email: user.email,
        });
        return new ClientResponse(201, true, 'done', updatedUser);
      }
      throw new GraphQLError('User not found');
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async uploadImage(
    user: EditUserInput & {userId: string},
    createReadStream: any,
    mimetype: string
  ) {
    try {
      let result;
      const stream = createReadStream();
      const uploadStream = createUploadStream(
        `ezrealtour-${user?.userId}-${Date.now()}.${mimetype.split('/')[1]}`
      );
      stream.pipe(uploadStream.writeStream);
      result = await uploadStream.promise;
      if (user.profileImg) {
        await deleteImage(user.profileImg || '');
      }

      const updatedUser = await UserModel.editUser({
        ...user,
        profileImg: result.Location,
      });
      // console.log(updatedUser);
      return new ClientResponse(201, true, 'done', updatedUser);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async uploadFile(
    user: {userId: string},
    createReadStream: any,
    mimetype: string,
    filename: string
  ) {
    console.log(mimetype, user, 'from uplod file');
    try {
      let result;
      const stream = createReadStream();
      const uploadStream = createUploadStream(
        `ezrealtour-${Date.now()}-${filename.replace(' ', '_')}`
      );
      stream.pipe(uploadStream.writeStream);
      result = await uploadStream.promise;
      console.log(result, 'uploaded file details');
      return new ClientResponse(201, true, 'done', {url: result.Location});
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async updatePushToken(input: {token: string; email: string}) {
    try {
      const user = await UserModel.updatePushToken(input);
      return new ClientResponse(201, true, 'done', user);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async inviteDesigner(input: inviteLancerInput) {
    try {
      const user = await UserModel.inviteLancer(input);
      return new ClientResponse(201, true, 'done', user);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  async inviteAdmin(input: inviteAdminInput) {
    try {
      const user = await UserModel.inviteAdmin(input);
      return new ClientResponse(201, true, 'done', user);
    } catch (error) {
      throw new GraphQLError(error);
    }
  }

  // async updateSecuritySetting(
  //   input: updateSecuritySettingInput & {email: string}
  // ) {
  //   try {
  //     const user = await UserModel.updateSecuritySetting(input);
  //     return new ClientResponse(201, true, 'done', user);
  //   } catch (error) {
  //     throw new GraphQLError(error);
  //   }
  // }

  // async updateNotificationSetting(
  //   input: updateNotificationSettingInput & {email: string}
  // ) {
  //   try {
  //     const user = await UserModel.updateNotificationSetting(input);
  //     return new ClientResponse(201, true, 'done', user);
  //   } catch (error) {
  //     throw new GraphQLError(error);
  //   }
  // }
}
