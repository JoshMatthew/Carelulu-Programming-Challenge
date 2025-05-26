import { MaxLength } from 'class-validator';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class Task {
  @Field(() => ID)
  id!: number;

  @Field(() => String)
  @MaxLength(60)
  task_title!: string;

  @Field(() => String, { nullable: true })
  task_description?: string | null;

  @Field(() => Boolean)
  completed!: boolean;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
