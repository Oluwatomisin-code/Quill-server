import {ReturnModelType} from '@typegoose/typegoose';
import User from '../users.schema';

export default async function getUser(
  userModel: ReturnModelType<typeof User>,
  userId: string
) {
  const user = await userModel.findById(userId);
  return user;
}
