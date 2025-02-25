import {ReturnModelType} from '@typegoose/typegoose';
import Application from '../application.schema';

export default async function getVersion(
  applicationModel: ReturnModelType<typeof Application>
) {
  const version = await applicationModel.find();
  if (!version) {
    throw new Error('Application not found');
  } else {
    // if (
    //   (schedule &&
    //     schedule.associatedAgent &&
    //     !schedule?.associatedAgent._id.equals(input.userId)) ||
    //   (schedule &&
    //     schedule.associatedBuyer &&
    //     schedule.associatedBuyer?._id.equals(input.userId))
    // ) {
    //   throw new Error('You are not authorized to view this schedule');
    // }
    return version;
  }
}
