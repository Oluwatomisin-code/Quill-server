import {ReturnModelType} from '@typegoose/typegoose';
import {inviteLancerInput} from '../../dto/inputs/user.input';
import User, {UserRole} from '../users.schema';
import UserMailer from '../../../utilities/mailer/mailTemplates/userMailer';

export default async function inviteLancer(
  userModel: ReturnModelType<typeof User>,
  input: inviteLancerInput
) {
  const generatedPassword = Math.random().toString(36).slice(-8);

  const lancerData = {
    email: input.email,
    password: generatedPassword,
    fullName: input.email.split('@')[0],
    phoneNumber: 0,
    role: UserRole.LANCER,
    service: 'Designer',
  };
  const newLancer = new userModel(lancerData);
  await newLancer.save();

  // Send invitation email
  await new UserMailer().inviteLancer({
    email: input.email,
    password: generatedPassword,
    name: lancerData.fullName,
    role: 'Lancer',
  });

  return newLancer;
}
