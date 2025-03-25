import {ReturnModelType} from '@typegoose/typegoose';
import {inviteLancerInput} from '../../dto/inputs/user.input';
import User, {UserRole} from '../users.schema';

export default async function inviteAdmin(
  userModel: ReturnModelType<typeof User>,
  input: inviteLancerInput
) {
  const randomstring = Math.random().toString(36).slice(-8);

  const adminData = {
    email: input.email,
    password: randomstring,
    fullName: input.email.split('@')[0],
    phoneNumber: 0,
    role: UserRole.ADMIN,
    service: 'Admin',
  };
  const newAdmin = new userModel(adminData);
  await newAdmin.save();

  return newAdmin;
}
