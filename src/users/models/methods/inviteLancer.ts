import {ReturnModelType} from '@typegoose/typegoose';
import {inviteLancerInput} from '../../dto/inputs/user.input';
import User, {UserRole} from '../users.schema';

export default async function inviteLancer(
  userModel: ReturnModelType<typeof User>,
  input: inviteLancerInput
) {
  const randomstring = Math.random().toString(36).slice(-8);

  const lancerData = {
    email: input.email,
    password: randomstring,
    fullName: input.email.split('@')[0],
    phoneNumber: 0,
    role: UserRole.LANCER,
    service: 'Designer',
  };
  const newLancer = new userModel(lancerData);
  await newLancer.save();

  return newLancer;
}
