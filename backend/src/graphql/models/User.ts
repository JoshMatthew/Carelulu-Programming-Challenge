import { ObjectType, Field, ID } from 'type-graphql';
import { Task } from './Task';

@ObjectType()
export class User {
  @Field(() => ID)
  id!: number;

  @Field(() => String)
  username!: string;

  @Field(() => String)
  password!: string;

  @Field(() => [Task], { nullable: true })
  tasks?: [Task?];
}

@ObjectType()
export class AuthPayload {
  @Field(() => String)
  token!: string;

  @Field(() => User)
  user!: User;
}
