import {
  index,
  modelOptions,
  prop,
  Ref,
  ReturnModelType,
  Severity,
} from '@typegoose/typegoose';
import {Field, ObjectType, registerEnumType} from 'type-graphql';

import {
  addProjectFileInput,
  assignDesignerInput,
  CreateProjectInput,
  deleteContractInput,
  editCompanyInput,
} from '../dto/inputs/projects.input';
import getProjectsByUserId from './methods/getProjectsByUserId';
import deleteContract from './methods/deleteCompany';
import editProject from './methods/editProject';
import getAssociatedProjects from './methods/getAssociatedProjects';
import createUIProject from './methods/createUIProject';
import createSMProject from './methods/createSMProject';
import User from '../../users/models/users.schema';
import getAllProjects from './methods/getAllProjects';
import assignDesignerToProject from './methods/assignDesignerToProject';
import getProjectById from './methods/getProjectById';
import {createUnionType} from 'type-graphql';
import countProjectsThisMonth from './methods/countProjectsThisMonth';
import {getUserSubscription} from './methods/getUserSubscription';
import {ProjectFile} from './project-file.schema';
import addProjectFile from './methods/addProjectFile';

export enum ProjectType {
  UI = 'UI',
  SOCIALMEDIA = 'SOCIALMEDIA',
  BRANDING = 'BRANDING',
  CUSTOM = 'CUSTOM',
}
export enum ProjectStatus {
  PENDING = 'PENDING',
  INPROGRESS = 'INPROGRESS',
  FULFILLED = 'FULFILLED',
}

export enum PaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
}

registerEnumType(ProjectType, {
  name: 'ProjectType',
});

registerEnumType(ProjectStatus, {
  name: 'ProjectStatus',
});

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});

@ObjectType()
export class Details {
  @Field()
  @prop({required: false})
  DateAssigned: Date;
}

// Create a union type for project details
const ProjectDetailsUnion = createUnionType({
  name: 'ProjectDetailsUnion',
  types: () => [uiProject, smProject, brandingProject] as const,
});

// Type A Project with specific fields
@ObjectType()
export class uiProject extends Details {
  @Field()
  @prop({required: true})
  productName: string;

  @Field()
  @prop({required: true})
  productCategory: string;

  @Field()
  @prop({required: false})
  productType: string;

  @Field()
  @prop({required: false})
  aboutProduct: string;

  @Field()
  @prop({required: false})
  brandingAlready: string;

  @Field()
  @prop({required: false})
  productFunctionalities: string;
}

// Type B Project with different fields
@ObjectType()
export class smProject extends Details {
  @Field()
  @prop({required: true})
  brandName: string;

  @Field()
  @prop({required: true})
  smCategory: string;

  @Field()
  @prop({required: false})
  smPerWeek: string;

  @Field()
  @prop({required: false})
  smDesignPlan: string;

  @Field()
  @prop({required: false})
  additionalInfo: string;

  @Field(() => String)
  @prop({required: false})
  brandingMaterialsUrl: string[];
}

@ObjectType()
export class brandingProject extends Details {
  @Field(() => String)
  @prop({required: true})
  companyName: String;

  @Field(() => String)
  @prop({required: true})
  taglineSlogan: String;

  @Field(() => String)
  @prop({required: true})
  brandColors: String;

  @Field(() => String)
  @prop({required: true})
  notBrandColors: String;

  @Field(() => String)
  @prop({required: true})
  brandDescription: String;

  @Field(() => String)
  @prop({required: true})
  companyNameProper: String;

  @Field(() => Boolean)
  @prop({required: true})
  taglineWithLogo: Boolean;

  @Field(() => Boolean)
  @prop({required: true})
  brandGuidelinesWithLogo: Boolean;
}

//----------------------------------------user class schema
@ObjectType({
  description: 'A company',
})
@index({name: 'text'})
@modelOptions({options: {allowMixed: Severity.ALLOW}})
class Project {
  @Field()
  _id: string;

  @Field()
  @prop({required: true})
  projectType: ProjectType;

  @Field()
  @prop({required: true, default: PaymentStatus.UNPAID})
  paymentStatus: PaymentStatus;

  @Field()
  @prop({required: false, default: ProjectStatus.PENDING})
  projectStatus: ProjectStatus;

  @Field()
  @prop({required: true, default: 240})
  price: number;

  @Field(() => User)
  @prop({required: false, default: null})
  associatedDesigner: Ref<User>;

  @Field(() => User)
  @prop({required: true})
  associatedClient: Ref<User>;

  @Field(() => [ProjectFile])
  @prop({ref: () => ProjectFile, required: true})
  projectUploadedLink: Ref<ProjectFile>[];

  @Field()
  @prop({required: false, default: Date.now()})
  createdAt: Date;

  @Field()
  @prop({required: false, default: Date.now()})
  lastModified: number;

  // @Field(() => Details, {nullable: true})
  // @prop({required: true, type: () => Details})
  // details: uiProject | smProject | brandingProject;

  // @Field(() => ProjectDetailsUnion, {nullable: true})
  // @prop({required: true, type: () => ProjectDetailsUnion})
  // details: typeof ProjectDetailsUnion;

  @Field(() => ProjectDetailsUnion, {nullable: true})
  @prop({required: true, type: () => Object}) // Use Object for mixed types
  details: uiProject | smProject | brandingProject;

  public static async createUIProject(
    this: ReturnModelType<typeof Project>,
    input: CreateProjectInput & {clientId: string}
  ) {
    return createUIProject(this, input);
  }

  public static async createSMProject(
    this: ReturnModelType<typeof Project>,
    input: CreateProjectInput & {clientId: string}
  ) {
    return createSMProject(this, input);
  }

  public static async editProject(
    this: ReturnModelType<typeof Project>,
    input: editCompanyInput
  ) {
    return editProject(this, input);
  }

  public static async assignDesignerToProject(
    this: ReturnModelType<typeof Project>,
    input: assignDesignerInput
  ) {
    return assignDesignerToProject(this, input);
  }

  public static async getProjectById(
    this: ReturnModelType<typeof Project>,
    input: {id: string}
  ) {
    return getProjectById(this, input);
  }

  public static async addProjectFile(
    this: ReturnModelType<typeof Project>,
    input: addProjectFileInput
  ) {
    return addProjectFile(this, input);
  }

  public static async getAssociatedProjects(
    this: ReturnModelType<typeof Project>,
    input: {userId: string; role: string}
  ) {
    return getAssociatedProjects(this, input);
  }
  public static async getAllProjects(this: ReturnModelType<typeof Project>) {
    return getAllProjects(this);
  }
  public static async getProjectsByUserId(
    this: ReturnModelType<typeof Project>,
    input: {userId: string; role: string}
  ) {
    return getProjectsByUserId(this, input);
  }

  public static async countProjectsThisMonth(
    this: ReturnModelType<typeof Project>,
    userId: string
  ) {
    return countProjectsThisMonth(this, userId);
  }

  public static async getUserSubscription(
    this: ReturnModelType<typeof Project>,
    userId: string
  ) {
    return getUserSubscription(this, userId);
  }

  public static async deleteCompany(
    this: ReturnModelType<typeof Project>,
    input: deleteContractInput
  ) {
    return deleteContract(this, input);
  }
}

export default Project;
