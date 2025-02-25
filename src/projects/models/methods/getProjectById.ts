import {ReturnModelType} from '@typegoose/typegoose';
import Project from '../project.schema';
import mongoose from 'mongoose';
import {uiProject, smProject, brandingProject} from '../project.schema'; // Adjust this import to your file structure

export default async function getProjectById(
  ProjectModel: ReturnModelType<typeof Project>,
  input: {id: string}
) {
  const project = await ProjectModel.aggregate([
    {$match: {_id: new mongoose.Types.ObjectId(input.id)}}, // Match the project by ID

    // Lookup for associatedDesigner
    {
      $lookup: {
        from: 'users', // The name of the User collection
        localField: 'associatedDesigner', // Field from the ProjectModel
        foreignField: '_id', // Field from the User model
        as: 'designerInfo', // Output array field
      },
    },
    // Lookup for associatedClient
    {
      $lookup: {
        from: 'users', // The name of the User collection
        localField: 'associatedClient', // Field from the ProjectModel
        foreignField: '_id', // Field from the User model
        as: 'clientInfo', // Output array field
      },
    },
    // Lookup for projectUploadedLink (array of references to projectfiles)
    {
      $lookup: {
        from: 'projectfiles', // The collection where projectfiles are stored
        localField: 'projectUploadedLink', // The field in Project referencing projectfiles
        foreignField: '_id', // Field in projectfiles that matches the reference
        as: 'uploadedFiles', // Populate the field with an array of projectfiles
      },
    },
    // Unwind the designerInfo if present
    {
      $unwind: {
        path: '$designerInfo',
        preserveNullAndEmptyArrays: true, // Keep the project even if there's no designer
      },
    },
    // Unwind the clientInfo if present
    {
      $unwind: {
        path: '$clientInfo',
        preserveNullAndEmptyArrays: true, // Keep the project even if there's no client
      },
    },
    // Project stage to clean up the output
    {
      $project: {
        _id: 1,
        projectType: 1,
        paymentStatus: 1,
        projectStatus: 1,
        price: 1,
        projectUploadedLink: '$uploadedFiles', // Keep projectUploadedLink as an array of populated files
        createdAt: 1,
        lastModified: 1,
        associatedClient: '$clientInfo', // Replace with populated data
        associatedDesigner: '$designerInfo', // Replace with populated data
        uploadedFiles: 1, // Include the populated project files
        details: {
          $cond: {
            if: {$eq: ['$projectType', 'UI']}, // Check for UI project type
            then: {
              $mergeObjects: [
                '$details',
                {
                  projectType: 'UI', // Include projectType for identification
                  /* Add any UI-specific fields here */
                },
              ],
            },
            else: {
              $cond: {
                if: {$eq: ['$projectType', 'SOCIALMEDIA']}, // Check for Social Media project type
                then: {
                  $mergeObjects: [
                    '$details',
                    {
                      projectType: 'SOCIALMEDIA', // Include projectType for identification
                      /* Add any SM-specific fields here */
                    },
                  ],
                },
                else: {
                  $cond: {
                    if: {$eq: ['$projectType', 'BRANDING']}, // Check for Branding project type
                    then: {
                      $mergeObjects: [
                        '$details',
                        {
                          projectType: 'BRANDING', // Include projectType for identification
                          /* Add any Branding-specific fields here */
                        },
                      ],
                    },
                    else: '$details', // Fallback to original details if no match
                  },
                },
              },
            },
          },
        },
      },
    },
  ]);

  // Check if a project was found
  if (project.length === 0) {
    return null; // or throw an error if appropriate
  }

  const foundProject = project[0];

  // Manually wrap the details object with the appropriate class
  switch (foundProject.projectType) {
    case 'UI':
      const uiDetails = new uiProject(); // Create a new instance
      Object.assign(uiDetails, foundProject.details); // Map fields from the result to the instance
      foundProject.details = uiDetails;
      break;
    case 'SOCIALMEDIA':
      const smDetails = new smProject(); // Create a new instance
      Object.assign(smDetails, foundProject.details); // Map fields from the result to the instance
      foundProject.details = smDetails;
      break;
    case 'BRANDING':
      const brandingDetails = new brandingProject(); // Create a new instance
      Object.assign(brandingDetails, foundProject.details); // Map fields from the result to the instance
      foundProject.details = brandingDetails;
      break;
    default:
      throw new Error('Unknown project type'); // Handle unknown types as needed
  }

  return foundProject; // Return the modified project
}
