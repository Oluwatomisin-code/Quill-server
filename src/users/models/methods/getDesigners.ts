import {ReturnModelType} from '@typegoose/typegoose';
import {usersFilterInput} from '../../dto/inputs/user.input';
import User from '../users.schema';
import ProjectModel from '../../../projects/models/project.model';

export default async function getLancers(
  userModel: ReturnModelType<typeof User>,
  input: usersFilterInput
) {
  if (input.role === 'ADMIN') {
    return await userModel
      .find({
        role: 'LANCER',
      })
      .sort({fullName: 'asc'});
  } else {
    try {
      const lancers = await ProjectModel.aggregate([
        {$match: {associatedClient: input._id}}, // Match projects for the specific lancer
        {
          $lookup: {
            from: 'users', // Assuming your user model is in 'users' collection
            localField: 'associatedDesigner',
            foreignField: '_id',
            as: 'clientInfo',
          },
        }, // Closing bracket for $lookup added here
        {$unwind: '$clientInfo'}, // Unwind the array of client info
        {
          $group: {
            _id: '$clientInfo._id',
            name: {$first: '$clientInfo.name'}, // Get the client's name
          },
        },
      ]);

      return lancers; // This will return an array of unique clients
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error; // Handle error as needed
    }
  }
}
