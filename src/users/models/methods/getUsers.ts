import {ReturnModelType} from '@typegoose/typegoose';
import {usersFilterInput} from '../../dto/inputs/user.input';
import User from '../users.schema';

export default async function getUsers(
  userModel: ReturnModelType<typeof User>,
  input: usersFilterInput
) {
  const users = await userModel
    .find({...input})
    // .populate('projects')
    .sort({firstName: 'asc'});
  return users;
}
