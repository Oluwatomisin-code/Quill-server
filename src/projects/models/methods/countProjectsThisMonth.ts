import {ReturnModelType} from '@typegoose/typegoose';
import Project from '../project.schema';

// Add this static method to your Project model
async function countProjectsThisMonth(
  ProjectModel: ReturnModelType<typeof Project>,
  userId: string
): Promise<{projectCountThisMonth: number}> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0); // Start of current month

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(startOfMonth.getMonth() + 1); // Start of next month

  const projectCount = await ProjectModel.countDocuments({
    associatedClient: userId,
    createdAt: {$gte: startOfMonth, $lt: endOfMonth},
  });

  return {projectCountThisMonth: projectCount};
}
export default countProjectsThisMonth;
