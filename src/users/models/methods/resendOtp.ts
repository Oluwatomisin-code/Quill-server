import {ReturnModelType} from '@typegoose/typegoose';

import UserMailer from '../../../utilities/mailer/mailTemplates/userMailer';
import User, {OtpPurpose} from '../users.schema';
import {getOTP} from '../../../utilities';
import {resendOtpInput} from 'users/dto/inputs/user.input';

export default async function resendOtp(
  userModel: ReturnModelType<typeof User>,
  input: resendOtpInput
): Promise<User> {
  const passwordResetToken = getOTP();
  const updatedUser = await userModel.findOneAndUpdate(
    {email: input.email},
    {otp: passwordResetToken},
    {new: true}
  );
  if (!updatedUser) throw Error('User does not exist');

  if (input.purpose === OtpPurpose.FORGOTPASSWORD) {
    new UserMailer().forgotPassword({
      email: input.email,
      passwordResetToken,
      name: (updatedUser as any)?.firstName,
    });
  } else {
    new UserMailer().createUser({
      email: input.email,
      verificationToken: passwordResetToken,
      name: (updatedUser as any)?.firstName,
    });
  }
  return updatedUser;
}
