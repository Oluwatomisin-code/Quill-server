import {getModelForClass, ReturnModelType} from '@typegoose/typegoose';
import Project from '../project.schema';
import {ProjectFile} from '../project-file.schema';
import {addProjectFileInput} from 'projects/dto/inputs/projects.input';
import mongoose from 'mongoose';

// Add this static method to your Project model
async function addProjectFile(
  ProjectModel: ReturnModelType<typeof Project>,
  input: addProjectFileInput
): Promise<Project> {
  const ProjectFileModel = getModelForClass(ProjectFile);
  // Find the project by ID
  const project = await ProjectModel.findById(input.projectId);
  if (!project) throw new Error('Project not found');

  // Create the new ProjectFile entry
  const newFile = new ProjectFileModel({
    fileUrl: input.fileUrl,
    fileType: input.fileType,
    date: new Date(),
    submittedBy: new mongoose.Types.ObjectId(input.submittedBy), // Should be a User ID
  });

  await newFile.save();

  project.lastModified = Date.now();

  // Add the new file to the project's uploaded files
  project.projectUploadedLink.push(newFile);
  await project.save();
  await project.populate('projectUploadedLink');

  return project;
}
export default addProjectFile;
