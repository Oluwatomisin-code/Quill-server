import {ReturnModelType} from '@typegoose/typegoose';
import {inviteAdminInput} from '../../dto/inputs/user.input';
import User, {UserRole} from '../users.schema';
import UserMailer from '../../../utilities/mailer/mailTemplates/userMailer';

export default async function inviteAdmin(
  userModel: ReturnModelType<typeof User>,
  input: inviteAdminInput
) {
  const generatedPassword = Math.random().toString(36).slice(-8);

  const adminData = {
    email: input.email,
    password: generatedPassword,
    fullName: input.email.split('@')[0],
    phoneNumber: 0,
    role: UserRole.ADMIN,
    service: 'Administrator',
  };
  const newAdmin = new userModel(adminData);
  await newAdmin.save();

  // Send invitation email
  await new UserMailer().inviteAdmin({
    email: input.email,
    password: generatedPassword,
    name: adminData.fullName,
    role: 'Administrator',
  });

  return newAdmin;
}
