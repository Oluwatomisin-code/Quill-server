import {getModelForClass} from '@typegoose/typegoose';
import Project from './project.schema';

const ProjectModel = getModelForClass(Project);

export default ProjectModel;
