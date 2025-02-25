import {
  index,
  modelOptions,
  prop,
  // Ref,
  ReturnModelType,
  Severity,
} from '@typegoose/typegoose';
import {GraphQLError} from 'graphql';

import {Field, ObjectType} from 'type-graphql';

@ObjectType()
export class AppVersion {
  @Field()
  @prop({required: true})
  version: string;

  @Field()
  @prop({required: true})
  priority: boolean;

  @Field()
  @prop({required: true})
  leastAcceptedVersion: string;
}

@ObjectType({
  description: 'Application info',
})
@index({name: 'text'})
@modelOptions({options: {allowMixed: Severity.ALLOW}})
class Application {
  @Field()
  _id: string;

  @Field(() => AppVersion)
  @prop({required: true})
  Version: AppVersion;

  @Field()
  @prop({default: Date.now})
  createdAt: Date;

  @Field()
  @prop({})
  ApiCount: number;

  public static async updateApiCount(
    this: ReturnModelType<typeof Application>
  ) {
    const application = await this.findOne();
    await application?.updateOne(
      {ApiCount: application.ApiCount + 1},
      {new: true}
    );
    return application;
  }

  // Static method to get application info
  public static async getApplication(
    this: ReturnModelType<typeof Application>
    // id: string // Assuming id is the unique identifier for your Application model
  ) {
    const application = await this.findOne();
    return application;
  }

  // Static method to get version info
  public static async getVersion(
    this: ReturnModelType<typeof Application>
    // id: string // Assuming id is the unique identifier for your Application model
  ) {
    const application = await this.findOne();
    // console.log(application, 'here');
    if (!application) {
      throw new Error('Application not found');
    }
    return application.Version;
  }

  public static async createApplication(
    this: ReturnModelType<typeof Application>
  ) {
    try {
      const version = {
        version: '1.1.3',
        priority: true,
        leastAcceptedVersion: '1.1.3',
      };

      const application = new this({
        Version: version,
        ApiCount: 0,
      });

      await application.save();
    } catch (error) {
      throw new GraphQLError(error);
    }
  }
}

export default Application;
