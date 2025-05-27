import { InputType, Field, ID, Int } from 'type-graphql';

@InputType()
export class CreateTaskInput {
  @Field(() => String)
  taskTitle!: string;

  @Field(() => String, { nullable: true })
  taskDescription?: string;
}

@InputType()
export class UpdateTaskInput {
  @Field(() => ID)
  id!: number;

  @Field(() => String, { nullable: true })
  taskTitle?: string;

  @Field(() => String, { nullable: true })
  taskDescription?: string;

  @Field(() => Boolean, { nullable: true })
  completed?: boolean;
}
