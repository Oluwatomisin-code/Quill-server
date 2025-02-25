import {ReturnModelType} from '@typegoose/typegoose';
import User, {brandingProject, smProject, uiProject} from '../project.schema';
import {UserRole} from '../../../users/models/users.schema';
import mongoose from 'mongoose';

export default async function getProjectsByUserId(
  ProjectModel: ReturnModelType<typeof User>,
  input: {userId: string; role: string}
) {
  console.log(input, 'inputtt');
  const projects = await ProjectModel.aggregate([
    {
      $match:
        input.role === UserRole.CLIENT
          ? {associatedClient: new mongoose.Types.ObjectId(input.userId)}
          : {associatedDesigner: new mongoose.Types.ObjectId(input.userId)},
    }, // Match the project by ID

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

  projects.forEach((item, index) => {
    switch (item.projectType) {
      case 'UI':
        const uiDetails = new uiProject(); // Create a new instance
        Object.assign(uiDetails, item.details); // Map fields from the result to the instance
        item.details = uiDetails;
        break;
      case 'SOCIALMEDIA':
        const smDetails = new smProject(); // Create a new instance
        Object.assign(smDetails, item.details); // Map fields from the result to the instance
        item.details = smDetails;
        break;
      case 'BRANDING':
        const brandingDetails = new brandingProject(); // Create a new instance
        Object.assign(brandingDetails, item.details); // Map fields from the result to the instance
        item.details = brandingDetails;
        break;
      default:
        throw new Error('Unknown project type'); // Handle unknown types as needed
    }
  });

  return projects;
}
