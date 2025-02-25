import {prop, Ref, modelOptions, Severity} from '@typegoose/typegoose';
import {Field, ObjectType, registerEnumType} from 'type-graphql';
import User from '../../users/models/users.schema'; // Assuming User schema exists

export enum FileType {
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  OTHER = 'OTHER',
}

registerEnumType(FileType, {
  name: 'FileType',
});

@ObjectType()
@modelOptions({options: {allowMixed: Severity.ALLOW}})
export class ProjectFile {
  @Field()
  _id: string;

  @Field(() => FileType)
  @prop({required: true})
  fileType: FileType;

  @Field()
  @prop({required: true})
  fileUrl: string; // The file's location or path (URL or server path)

  @Field(() => Date)
  @prop({required: true})
  date: Date;

  @Field(() => User)
  @prop({ref: () => User, required: true})
  submittedBy: Ref<User>;
}
