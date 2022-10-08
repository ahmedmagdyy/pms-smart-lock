import { Field, InputType } from 'type-graphql';

@InputType()
export class ReservationCreateInput {
  @Field(() => Number)
  unitId!: number;

  @Field(() => String)
  guestName!: string;

  @Field(() => Date)
  checkIn!: Date;

  @Field(() => Date)
  checkOut!: Date;
}
