import {getModelForClass} from '@typegoose/typegoose';
import Schedule from './application.schema';

const ApplicationModel = getModelForClass(Schedule);

export default ApplicationModel;
