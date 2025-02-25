import {Field, InputType} from 'type-graphql';

@InputType()
export class addCompanyInput {
  @Field({nullable: false})
  associatedClient: string;

  @Field({nullable: false})
  companyName: string;
}

@InputType()
export class addProjectInput {
  @Field({nullable: false})
  companyId: string;

  @Field({nullable: false})
  mls_id: string;

  @Field({nullable: true})
  inspectionEndDate: Date;

  @Field({nullable: true})
  escrowEndDate: Date;
}

@InputType()
export class editCompanyInput {
  @Field({nullable: false})
  clientId: string;

  @Field({nullable: true})
  taglineSlogan: string;

  @Field({nullable: true})
  brandColors: string;

  @Field({nullable: true})
  notBrandColors: string;

  @Field({nullable: true})
  brandDescription: string;

  @Field({nullable: true})
  companyNameProper: string;

  @Field({nullable: true})
  taglineWithLogo: boolean;

  @Field({nullable: true})
  brandGuidelinesWithLogo: boolean;
}

@InputType()
export class assignDesignerInput {
  @Field({nullable: false})
  _id: string;

  @Field({nullable: false})
  designerId: string;
}

@InputType()
export class getProjectByIdInput {
  @Field({nullable: false})
  id: string;
}

@InputType()
export class getProjectsByUserIdInput {
  @Field({nullable: false})
  userId: string;
  @Field({nullable: false})
  role: string;
}

@InputType()
export class addProjectFileInput {
  @Field({nullable: false})
  projectId: string;
  @Field({nullable: false})
  fileUrl: string;
  @Field({nullable: false})
  fileType: string;
  @Field({nullable: false})
  submittedBy: string;
}

@InputType()
export class CreateProjectInput {
  @Field({nullable: false})
  projectType: string;
  // ui
  @Field({nullable: true})
  productName: string;

  @Field({nullable: true})
  productCategory: string;

  @Field({nullable: true})
  productType: string;

  @Field({nullable: true})
  aboutProduct: string;

  @Field({nullable: true})
  brandingAlready: string;

  @Field({nullable: true})
  productFunctionalities: string;
  //sm

  @Field({nullable: true})
  brandName: string;

  @Field({nullable: true})
  smCategory: string;

  @Field({nullable: true})
  smPerWeek: string;

  @Field({nullable: true})
  smDesignPlan: string;

  @Field({nullable: true})
  additionalInfo: string;

  @Field({nullable: true})
  brandingMaterialsUrl: string;
}

@InputType()
export class getSelectedContractsInput {
  @Field(() => [String], {nullable: false})
  ids: [String];
}

@InputType()
export class getContractByUserIdInput {
  @Field(() => [String], {nullable: false})
  userId: String;
}

@InputType()
export class deleteContractInput {
  @Field(() => String, {nullable: false})
  agentId: string;

  @Field(() => String, {nullable: false})
  buyerId: string;
}
