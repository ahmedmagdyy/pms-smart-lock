import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { prisma } from '../../prismaClient';
import {
  CancelReservationInput,
  ReservationCreateInput,
  UpdateReservationInput,
} from './types/inputs';
import { Reservation } from './types/reservation';
@Resolver()
export class SmartLockResolver {
  @Query(() => String)
  async hello() {
    return 'Hello World!';
  }

  @Mutation(() => Reservation)
  async createReservation(@Arg('data') data: ReservationCreateInput) {
    const newReservation = await prisma.reservation.create({
      data,
    });
    return {
      ...newReservation,
      id: Number(newReservation.id), // to solve prisma returning BigInt type 9n instead of bigint 9
      unitId: Number(newReservation.unitId),
    };
  }

  @Mutation(() => Reservation)
  async UpdateReservation(@Arg('data') data: UpdateReservationInput) {
    const { reservationId, ...rest } = data;
    const updatedReservation = await prisma.reservation.update({
      where: {
        id: reservationId,
      },
      data: {
        checkIn: rest.checkIn,
        checkOut: rest.checkOut,
        guestName: rest.guestName,
        unitId: rest.unitId,
      },
    });
    return {
      ...updatedReservation,
      id: Number(updatedReservation.id),
      unitId: Number(updatedReservation.unitId),
    };
  }

  @Mutation(() => Reservation)
  async cancelReservation(@Arg('data') data: CancelReservationInput) {
    const canceledReservation = await prisma.reservation.update({
      where: {
        id: data.reservationId,
      },
      data: {
        isCancelled: true,
      },
    });
    return {
      ...canceledReservation,
      id: Number(canceledReservation.id),
      unitId: Number(canceledReservation.unitId),
    };
  }
}
