import {ReturnModelType} from '@typegoose/typegoose';
import {EditUserInput} from '../../dto/inputs/user.input';
import User from '../users.schema';

export default async function editUser(
  userModel: ReturnModelType<typeof User>,
  input: EditUserInput & {userId: string}
) {
  const user = await userModel.findById(input.userId);
  if (!user) {
    throw new Error('User not found');
  } else {
    return await userModel.findByIdAndUpdate(
      input.userId,
      {...input},
      {new: true}
    );
  }
}
