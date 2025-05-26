import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class LoginUser {
  @Field(() => String)
  username!: string;

  @Field(() => String)
  password!: string;
}

@InputType()
export class CreateUser {
  @Field(() => String)
  username!: string;

  @Field(() => String)
  password!: string;
}
