import {ReturnModelType} from '@typegoose/typegoose';
import Application from '../application.schema';

export default async function getApplication(
  applicationModel: ReturnModelType<typeof Application>
) {
  const application = await applicationModel.find();
  if (!application) {
    throw new Error('Application not found');
  } else {
    return application;
  }
}
