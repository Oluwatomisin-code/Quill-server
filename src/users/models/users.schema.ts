import {
  index,
  modelOptions,
  pre,
  prop,
  ReturnModelType,
  Severity,
} from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';
import {Field, ObjectType, registerEnumType} from 'type-graphql';
import {
  EditUserInput,
  updateResetPasswordInput,
  usersFilterInput,
  changePasswordInput,
  // getUsersInput,
  LoginInput,
  CreateUserInput,
  verifyInput,
  resendOtpInput,
} from 'users/dto/inputs/user.input';
import editUser from './methods/editUser';
import forgotPassword from './methods/forgotPassword';
import getUser from './methods/getUser';

import {updateResetPassword} from './methods/updateResetPassword';
import {changePassword} from './methods/changePassword';
import {IsEmail, IsNotEmpty} from 'class-validator';
import createUser from './methods/createUser';
import login from './methods/login';

import verifyEmail from './methods/verifyEmail';
import resendOtp from './methods/resendOtp';
import updatePushToken from './methods/updatePushToken';

import getAllUsers from './methods/getAllUsers';
import getClients from './methods/getClients';
import getUsers from './methods/getUsers';
import getLancers from './methods/getDesigners';
import getMessageableUsers from './methods/getMessageableuser';

export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  LANCER = 'LANCER',
}
export enum OtpPurpose {
  VERIFYEMAIL = 'VERIFYEMAIL',
  FORGOTPASSWORD = 'FORGOTPASSWORD',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVE = 'ARCHIVE',
}

export enum SubscriptionPlan {
  BASIC = 'STARTER',
  PREMIUM = 'PREMIUM',
  ULTIMATE = 'ULTIMATE',
  NIL = 'NIL',
}

registerEnumType(UserStatus, {
  name: 'UserStatus',
});
registerEnumType(OtpPurpose, {
  name: 'OtpPurpose',
});
registerEnumType(UserRole, {
  name: 'UserRole',
});
registerEnumType(SubscriptionPlan, {
  name: 'SubscriptionPlan',
});

//pre save hook for hasshing password
@pre<User>('save', function generateHash(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
  }
  return next();
})
// //--------------------------------------pre save hook for confirming no duplicate document exist
// @pre<User>('save', async function (next) {
//   const existingUser = await UserModel.findOne({email: this.email});
//   if (existingUser) {
//     const error = new Error('Email already exists') as any;
//     error.code = 11000; // MongoDB duplicate key error code
//     next(error);
//   } else {
//     next();
//   }
// })
//----------------------------------------user class schema

@ObjectType({
  description: 'A user',
})
@index({name: 'text'})
@modelOptions({options: {allowMixed: Severity.ALLOW}})
class User {
  @Field()
  _id: string;

  @Field()
  @prop({required: true})
  @IsEmail({}, {message: 'Invalid email format'})
  @IsNotEmpty({message: 'Email is required'})
  email: string;

  @prop({required: true})
  password: string;

  @Field()
  @prop({required: true})
  fullName: string;

  // new
  @Field()
  @prop({required: false})
  DOB: Date;

  @Field()
  @prop({required: true})
  phoneNumber: number;

  @Field()
  @prop({required: false})
  profileImg: string;

  @Field()
  @prop({required: false})
  country: string;

  @Field()
  @prop({required: false})
  state: string;

  @Field()
  @prop({required: false})
  businessName: string;

  @Field()
  @prop({required: false, default: false})
  isEmailVerified: boolean;

  @Field()
  @prop({required: false})
  otp: string;

  @Field()
  @prop({required: true, default: UserRole.CLIENT})
  role: UserRole;

  @Field()
  @prop({required: true, default: 'Designer'})
  service: string;

  @Field()
  @prop({required: false, default: UserStatus.ACTIVE})
  status: string;

  @Field()
  @prop({required: false, default: SubscriptionPlan.NIL})
  subscriptionPlan: SubscriptionPlan;

  @Field()
  @prop({required: false, default: SubscriptionPlan.NIL})
  paymentRef: SubscriptionPlan;

  @Field()
  @prop({required: false})
  pushToken: string;

  @Field()
  @prop({default: Date.now})
  createdAt: Date;

  public static async createUser(
    this: ReturnModelType<typeof User>,
    input: CreateUserInput
  ) {
    return createUser(this, input);
  }

  public static async login(
    this: ReturnModelType<typeof User>,
    input: LoginInput
  ) {
    return login(this, input);
  }
  public static async editUser(
    this: ReturnModelType<typeof User>,
    input: EditUserInput & {userId: string}
  ) {
    return editUser(this, input);
  }

  public static async verifyEmail(
    this: ReturnModelType<typeof User>,
    input: verifyInput
  ) {
    return verifyEmail(this, input);
  }
  public static async forgotPassword(
    this: ReturnModelType<typeof User>,
    email: string
  ) {
    return forgotPassword(this, email);
  }
  public static async resendOtp(
    this: ReturnModelType<typeof User>,
    input: resendOtpInput
  ) {
    return resendOtp(this, input);
  }

  public static async updateResetPassword(
    this: ReturnModelType<typeof User>,
    input: updateResetPasswordInput
  ) {
    return updateResetPassword(this, input);
  }

  public static async changePassword(
    this: ReturnModelType<typeof User>,
    input: changePasswordInput
  ) {
    return changePassword(this, input);
  }

  public static async getClients(
    this: ReturnModelType<typeof User>,
    input: usersFilterInput
  ) {
    return getClients(this, input);
  }

  public static async getLancers(
    this: ReturnModelType<typeof User>,
    input: usersFilterInput
  ) {
    return getLancers(this, input);
  }

  public static async getMessageableUsers(
    this: ReturnModelType<typeof User>,
    input: usersFilterInput
  ) {
    return getMessageableUsers(this, input);
  }

  public static async getUser(
    this: ReturnModelType<typeof User>,
    userId: string
  ) {
    return getUser(this, userId);
  }

  public static async getAllUsers(
    this: ReturnModelType<typeof User>,
    input: usersFilterInput
  ) {
    return getAllUsers(this, input);
  }

  public static async getUsers(
    this: ReturnModelType<typeof User>,
    input: usersFilterInput
  ) {
    return getUsers(this, input);
  }

  public static async updatePushToken(
    this: ReturnModelType<typeof User>,
    input: {
      token: string;
      email: string;
    }
  ) {
    return updatePushToken(this, input);
  }
}

export default User;
