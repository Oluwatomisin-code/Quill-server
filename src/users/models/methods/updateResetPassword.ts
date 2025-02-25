import {ReturnModelType} from '@typegoose/typegoose';
import {updateResetPasswordInput} from '../../../users/dto/inputs/user.input';
import UserMailer from '../../../utilities/mailer/mailTemplates/userMailer';
import bcrypt from 'bcryptjs';
import User from '../users.schema';

export async function updateResetPassword(
  userModel: ReturnModelType<typeof User>,
  input: updateResetPasswordInput
): Promise<User> {
  const {token, newPassword, email} = input;
  const hashed = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
  const user = await userModel.findOneAndUpdate(
    {otp: token, email: email},
    {password: hashed},
    {new: true}
  );
  if (!user) throw Error('Invalid reset code');
  new UserMailer().updateResetPassword({
    email: user.email,
    name: user.firstName,
  });
  user.otp = '';
  await user.save();
  return user;
}
