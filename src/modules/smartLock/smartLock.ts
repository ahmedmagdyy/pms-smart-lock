import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { eventEmitter } from '../../events/eventEmitter';
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
    // make sure unit exists
    const unit = await prisma.unit.findFirst({
      where: {
        id: data.unitId,
      },
    });
    if (!unit) {
      throw new Error('Unit does not exist');
    }

    // make sure the unit is not already reserved for the given dates
    const isReserved = await prisma.reservation.findFirst({
      where: {
        unitId: data.unitId,
        checkIn: {
          lte: data.checkIn,
        },
        checkOut: {
          gte: data.checkIn,
        },
      },
    });
    if (isReserved) {
      throw new Error('Unit is already reserved for the given dates');
    }

    const newReservation = await prisma.reservation.create({
      data,
    });
    eventEmitter.emit('reservationCreated', newReservation);
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
    eventEmitter.emit('reservationUpdated', updatedReservation);
    return {
      ...updatedReservation,
      id: Number(updatedReservation.id),
      unitId: Number(updatedReservation.unitId),
    };
  }

  @Mutation(() => Reservation)
  async cancelReservation(@Arg('data') data: CancelReservationInput) {
    // make sure reservation exists
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: data.reservationId,
      },
    });
    if (!reservation) {
      throw new Error('Reservation does not exist');
    }

    const canceledReservation = await prisma.reservation.update({
      where: {
        id: data.reservationId,
      },
      data: {
        isCancelled: true,
      },
    });
    eventEmitter.emit('reservationCanceled', canceledReservation);

    return {
      ...canceledReservation,
      id: Number(canceledReservation.id),
      unitId: Number(canceledReservation.unitId),
    };
  }
}
