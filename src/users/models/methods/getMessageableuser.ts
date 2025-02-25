import {ReturnModelType} from '@typegoose/typegoose';
import ProjectModel from '../../../projects/models/project.model';
import {usersFilterInput} from '../../../users/dto/inputs/user.input';
import User, {UserRole} from '../users.schema';

export default async function getMessageableUsers(
  userModel: ReturnModelType<typeof User>,
  input: usersFilterInput
) {
  const messageable = await ProjectModel.aggregate([
    {
      $match:
        input.role === UserRole.CLIENT
          ? {associatedClient: input._id}
          : {associatedDesigner: input._id},
    }, // Match projects for the specific lancer
    {
      $lookup: {
        from: 'users', // Assuming your user model is in 'users' collection
        localField:
          input.role === UserRole.CLIENT
            ? 'associatedDesigner'
            : 'associatedClient',
        foreignField: '_id',
        as: 'clientInfo',
      },
    }, // Closing bracket for $lookup added here
    {$unwind: '$clientInfo'}, // Unwind the array of client info
    {
      $group: {
        _id: '$clientInfo._id',
        fullName: {$first: '$clientInfo.fullName'}, // Get the client's name
        role: {$first: '$clientInfo.role'},
      },
    },
    {
      $unionWith: {
        coll: 'users', // The collection where admin data is stored
        pipeline: [
          {$match: {role: 'ADMIN'}}, // Filter for admin users
          {
            $project: {
              _id: 1, // Include the user ID
              fullName: 1, // Include the full name
              role: 1,
            },
          },
        ],
      },
    },
  ]);
  return messageable;
}
