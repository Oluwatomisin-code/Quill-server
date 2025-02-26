import {ReturnModelType} from '@typegoose/typegoose';

import UserMailer from '../../../utilities/mailer/mailTemplates/userMailer';
import User from '../users.schema';
import {getOTP} from '../../../utilities';

export default async function forgotPassword(
  userModel: ReturnModelType<typeof User>,
  email: string
): Promise<User> {
  const passwordResetToken = getOTP();
  const updatedUser = await userModel.findOneAndUpdate(
    {email},
    {otp: passwordResetToken},
    {new: true}
  );
  if (!updatedUser) throw Error('User does not exist');

  new UserMailer().forgotPassword({
    email,
    passwordResetToken,
    name: (updatedUser as any)?.firstName,
  });
  return updatedUser;
}
