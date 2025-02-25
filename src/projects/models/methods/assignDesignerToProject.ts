import {ReturnModelType} from '@typegoose/typegoose';
import Project, {ProjectStatus} from '../project.schema';
import {assignDesignerInput} from '../../dto/inputs/projects.input';
import mongoose from 'mongoose';

export default async function assignDesignerToProject(
  ProjectModel: ReturnModelType<typeof Project>,
  input: assignDesignerInput
) {
  // Check if the project exists
  const project = await ProjectModel.findOne({_id: input._id});

  if (!project) {
    throw new Error('Project not found');
  }

  // Check if designerId is valid
  if (!mongoose.Types.ObjectId.isValid(input.designerId)) {
    throw new Error('Invalid designerId');
  }

  console.log('Assigning designer:', input);

  // Update the project with the new associatedDesigner and status
  return await ProjectModel.findOneAndUpdate(
    {
      _id: input._id, // Use _id here, not id
    },
    {
      $set: {
        associatedDesigner: new mongoose.Types.ObjectId(input.designerId), // Convert to ObjectId
        projectStatus: ProjectStatus.INPROGRESS, // Set the project status
        lastModified: Date.now(), // Update the last modified time
      },
    },
    {
      new: true, // Return the updated document
    }
  );
}
