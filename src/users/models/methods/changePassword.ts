import {ReturnModelType} from '@typegoose/typegoose';
import {changePasswordInput} from '../../dto/inputs/user.input';
import bcrypt from 'bcryptjs';
import User from '../users.schema';

export async function changePassword(
  userModel: ReturnModelType<typeof User>,
  input: changePasswordInput
): Promise<Boolean> {
  const {oldPassword, userId, newPassword} = input;
  const matchingUser: User | null = await userModel.findOne({_id: userId});
  if (!matchingUser) throw Error('User not found!');
  const isMatch = await bcrypt.compare(oldPassword, matchingUser.password);
  if (!isMatch) throw Error('Wrong old password!');
  const hashed = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
  await userModel.findOneAndUpdate(
    {_id: userId},
    {password: hashed},
    {new: true}
  );
  return true;
}
