import {ReturnModelType} from '@typegoose/typegoose';
import User from '../users.schema';

export default async function updatePushToken(
  userModel: ReturnModelType<typeof User>,
  input: {
    token: string;
    email: string;
  }
) {
  const user = await userModel.findOneAndUpdate(
    {email: input.email},
    {pushToken: input.token},
    {new: true}
  );
  return user;
}
