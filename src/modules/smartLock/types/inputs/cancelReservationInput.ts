import { Field, InputType } from 'type-graphql';
import { ReservationCreateInput } from './reservationInput';

@InputType()
export class CancelReservationInput extends ReservationCreateInput {
  @Field(() => Number)
  reservationId!: number;
}
