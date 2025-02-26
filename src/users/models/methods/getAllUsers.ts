import {ReturnModelType} from '@typegoose/typegoose';
import {usersFilterInput} from '../../dto/inputs/user.input';
import User from '../users.schema';

export default async function getAllUsers(
  userModel: ReturnModelType<typeof User>,
  input: usersFilterInput
) {
  console.log(input, 'getAllUsers');
  return await userModel
    .find({
      $or: [{role: 'CLIENT'}, {role: 'LANCER'}],
    })
    .sort({fullName: 'asc'});
}
