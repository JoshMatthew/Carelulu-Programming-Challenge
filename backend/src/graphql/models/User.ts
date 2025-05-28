import { ObjectType, Field, ID } from 'type-graphql';
import { Task } from './Task';

@ObjectType()
export class User {
  @Field(() => ID)
  id!: number;

  @Field(() => String)
  user_name!: string;

  @Field(() => String)
  password!: string;

  @Field(() => [Task], { nullable: true })
  tasks?: [Task?];
}
