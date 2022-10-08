import { Field, ObjectType } from 'type-graphql';
// import { AccessCode } from './accessCode';
// import { Unit } from './unit';

@ObjectType()
export class Reservation {
  @Field(() => Number)
  id!: bigint;

  @Field(() => Number)
  unitId!: bigint;

  @Field(() => String)
  guestName!: string;

  @Field(() => Date)
  checkIn!: Date;

  @Field(() => Date)
  checkOut!: Date;

  @Field(() => Boolean)
  isCancelled!: boolean;

  // @Field(() => Unit)
  // unit?: Unit;

  // @Field(() => AccessCode, { nullable: true })
  // AccessCode?: AccessCode;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}
