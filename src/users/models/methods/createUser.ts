import {ReturnModelType} from '@typegoose/typegoose';
import User from '../users.schema';
import crypto from 'crypto';
import {CreateUserInput} from 'users/dto/inputs/user.input';
import {GraphQLError} from 'graphql';
import UserMailer from '../../../utilities/mailer/mailTemplates/userMailer';

export default async function createUser(
  userModel: ReturnModelType<typeof User>,
  input: CreateUserInput
) {
  try {
    const existingUser: any | null = await userModel.findOne({
      email: input.email,
    });

    if (existingUser) {
      const error = new Error('Email already exists') as any;
      error.code = 11000; // MongoDB duplicate key error code
      throw new GraphQLError(error);
    } else {
      const buffer = await crypto.randomBytes(3);
      const verificationToken = buffer.toString('hex');
      const newDoc = new userModel({...input, otp: verificationToken});
      await newDoc.save();

      new UserMailer().createUser({
        email: newDoc?.email,
        verificationToken,
        name: newDoc?.fullName,
      });
      return newDoc;
    }
  } catch (error) {
    throw new GraphQLError(error);
  }
}
