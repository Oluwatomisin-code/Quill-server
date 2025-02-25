import {ReturnModelType} from '@typegoose/typegoose';
import {usersFilterInput} from '../../dto/inputs/user.input';
import User from '../users.schema';
import Project from 'projects/models/project.schema';
import mongoose from 'mongoose';

export default async function getAllUsers(
  userModel: ReturnModelType<typeof User>,
  input: usersFilterInput
) {
  return await userModel
    .find({
      $or: [{role: 'CLIENT'}, {role: 'LANCER'}],
    })
    .sort({fullName: 'asc'});
}
