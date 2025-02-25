import {ReturnModelType} from '@typegoose/typegoose';
import User from '../users.schema';
import {LoginInput} from 'users/dto/inputs/user.input';
import {GraphQLError} from 'graphql';
import ClientResponse from '../../../utilities/response';
import {createToken} from '../../../utilities';
import bcrypt from 'bcryptjs';

export default async function login(
  userModel: ReturnModelType<typeof User>,
  input: LoginInput
) {
  try {
    const existingUser: User | null = await userModel
      .findOne({
        email: input.email.trim(),
      })
      .populate('invitedBy');
    if (!existingUser) {
      return new ClientResponse(404, false, 'User not found');
    } else {
      console.log(
        bcrypt.compare(input.password, existingUser.password),
        'passs check'
      );
      if (!bcrypt.compareSync(input.password, existingUser.password)) {
        console.log('wrong password');
        throw new GraphQLError('wrong password');
      } else {
        const token = createToken(
          {id: existingUser._id, email: existingUser.email},
          '1y'
        );
        const result = Object.assign(existingUser, {
          token,
          password: undefined,
        });
        return result;
      }
    }
  } catch (error) {
    throw new GraphQLError(error);
  }
}
