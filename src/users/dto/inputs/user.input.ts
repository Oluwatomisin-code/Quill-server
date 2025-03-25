import {Field, InputType} from 'type-graphql';
// import {UserBankingInformationInput} from '../../../users/models/subDocument/user.bankingInformation';
// import {UserOfficialInformationInput} from '../../../users/models/subDocument/user.officialInformation';
// import {UserPersonalInformationInput} from '../../../users/models/subDocument/user.personalInformation';
// import {UserSecondaryContactInput} from '../../../users/models/subDocument/user.secondaryContacts';
import {
  OtpPurpose,
  UserRole,
  UserStatus,
} from '../../../users/models/users.schema';

@InputType()
export class CreateUserInput {
  @Field({nullable: false})
  fullName: string;

  @Field({nullable: false})
  email: string;

  @Field({nullable: false})
  phoneNumber: string;

  @Field({nullable: false})
  password: string;

  //new
  @Field({nullable: true})
  DOB: Date;

  // new
  @Field({nullable: true})
  businessName: string;

  @Field({nullable: true})
  role: string;

  @Field({nullable: true})
  service: string;

  @Field({nullable: true})
  country: string;
}
@InputType()
export class verifyInput {
  @Field({nullable: false})
  token: string;

  @Field({nullable: false})
  email: string;
}

@InputType()
export class LoginInput {
  @Field({nullable: false})
  email: string;

  @Field({nullable: false})
  password: string;
}

@InputType()
export class EditUserInput {
  @Field()
  userId?: string;

  @Field()
  email: string;

  @Field({nullable: true})
  firstName?: string;

  @Field({nullable: true})
  lastName?: string;

  @Field(() => UserStatus, {nullable: true})
  status?: string;

  @Field({nullable: true})
  profileImg?: string;

  @Field({nullable: true})
  businessName?: string;
}

@InputType()
export class EditBuyerStatusInput {
  @Field()
  userId: string;

  @Field()
  status: string;
}

@InputType()
export class updateResetPasswordInput {
  @Field({nullable: false})
  email: string;

  @Field({nullable: false})
  token: string;

  @Field({nullable: false})
  newPassword: string;
}

@InputType()
export class changePasswordInput {
  @Field({nullable: false})
  oldPassword: string;

  @Field({nullable: false})
  userId: string;

  @Field({nullable: false})
  newPassword: string;
}

@InputType()
export class resendOtpInput {
  @Field({nullable: false})
  email: string;

  @Field(() => OtpPurpose, {nullable: false})
  purpose: OtpPurpose;
}

@InputType()
export class usersFilterInput {
  @Field(() => UserRole, {nullable: true})
  role: string;

  @Field(() => String, {nullable: true})
  _id: string;
}

@InputType()
export class getUsersInput {
  @Field({nullable: true})
  current: string;

  @Field({nullable: true})
  limit: string;

  @Field({nullable: true})
  activityType: string;

  @Field({nullable: true})
  user: string;

  @Field(() => [String], {nullable: true})
  dateRange: string[];

  @Field(() => String, {nullable: true})
  organization: string;
}

@InputType()
export class addBuyerInput {
  // @Field({nullable: false})
  // userId: string;

  @Field({nullable: false})
  buyerId: string;
}

@InputType()
export class paginationInput {
  @Field({nullable: true})
  current: string;

  @Field({nullable: true})
  limit: string;
}

@InputType()
export class updatePushTokenInput {
  @Field({nullable: false})
  token: string;
}

@InputType()
export class inviteLancerInput {
  @Field({nullable: false})
  email: string;
}

@InputType()
export class inviteAdminInput {
  @Field({nullable: false})
  email: string;
}
