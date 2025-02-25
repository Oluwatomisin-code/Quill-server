import {ReturnModelType} from '@typegoose/typegoose';
import User from '../users.schema';
import {verifyInput} from '../../../users/dto/inputs/user.input';

export default async function verifyEmail(
  userModel: ReturnModelType<typeof User>,
  input: verifyInput
): Promise<User> {
  console.log(input.email, input.token);
  const foundUser = await userModel.findOne({
    email: input.email,
    otp: input.token.toLocaleLowerCase(),
  });
  if (!foundUser) {
    throw Error('User or token does not exist');
  } else {
    const verifiedUser = await foundUser.updateOne(
      {otp: null, isEmailVerified: true},
      {new: true}
    );

    return verifiedUser;
  }
}
