// // import {
// //   ScheduleFilter,
// //   ScheduleStatus,
// //   ScheduleType,
// // } from '../../../Schedule/models/schedule.schema';
// import {Field, InputType} from 'type-graphql';

// @InputType()
// class SchedulePropertyFieldInput {
//   @Field({nullable: true})
//   propertyName: string;

//   @Field({nullable: false})
//   mls_id: string;

//   @Field({nullable: false})
//   startTime: Date;

//   @Field({nullable: false})
//   endTime: Date;
// }
// @InputType()
// export class CreateScheduleInput {
//   @Field(() => [SchedulePropertyFieldInput], {nullable: false})
//   properties: SchedulePropertyFieldInput[];

//   @Field(() => ScheduleType, {nullable: false})
//   scheduleType: ScheduleType;

//   @Field(() => String, {nullable: false})
//   associatedBuyer: string;

//   @Field(() => String, {nullable: false})
//   associatedAgent: string;

//   @Field(() => Date, {nullable: false})
//   scheduleDate: Date;
// }

// @InputType()
// export class EditScheduleInput {
//   @Field(() => String, {nullable: false})
//   id: string;

//   // @Field(() => [SchedulePropertyFieldInput], {nullable: false})
//   // properties: SchedulePropertyFieldInput[];

//   @Field(() => String, {nullable: true})
//   scheduleType: string;

//   @Field(() => ScheduleStatus, {nullable: true})
//   status: ScheduleStatus;

//   @Field(() => Date, {nullable: true})
//   scheduleDate: Date;

//   @Field(() => String, {nullable: true})
//   associatedBuyer: string;
// }
// @InputType()
// export class declineScheduleRequestInput {
//   @Field(() => String, {nullable: false})
//   id: string;

//   // @Field(() => [SchedulePropertyFieldInput], {nullable: false})
//   // properties: SchedulePropertyFieldInput[];

//   @Field(() => String, {nullable: true})
//   reason: string;

//   @Field(() => String, {nullable: true})
//   comment: string;
// }

// @InputType()
// export class FilterScheduleInput {
//   @Field(() => ScheduleFilter, {nullable: true})
//   filter: ScheduleFilter;

//   @Field(() => Date, {nullable: true})
//   scheduleDate: Date;

//   @Field(() => Date, {nullable: true})
//   endDate: Date;

//   // @Field(() => String, {nullable: true})
//   // userId: string;
// }

// @InputType()
// export class GetSchedulesByUserInput {
//   @Field(() => String, {nullable: false})
//   id: string;
// }

// @InputType()
// export class RatingFeedback {
//   @Field(() => Number, {nullable: false})
//   stars: number;

//   @Field(() => String, {nullable: false})
//   feedback: string;
// }

// @InputType()
// export class updateScheduleFeedbackInput {
//   @Field(() => String, {nullable: false})
//   id: string;

//   @Field(() => String, {nullable: false})
//   mlsId: string;

//   @Field(() => String, {nullable: true})
//   Notes: string;

//   @Field(() => Boolean, {nullable: true})
//   interested: boolean;

//   @Field(() => RatingFeedback, {nullable: true})
//   experience: RatingFeedback;

//   @Field(() => RatingFeedback, {nullable: true})
//   satisfaction: RatingFeedback;
// }
