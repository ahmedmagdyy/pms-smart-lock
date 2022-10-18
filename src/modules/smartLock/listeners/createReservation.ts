import { Reservation } from '@prisma/client';
import { eventEmitter } from '../../../events/eventEmitter';
import { prisma } from '../../../prismaClient';
import { generateReservationAccessCode } from '../../../helpers/reservationAccessCode';

const postReservationCreate = async (reservation: Reservation) => {
  const unit = await prisma.unit.findFirst({
    where: {
      id: reservation.unitId,
    },
    select: {
      id: true,
      Lock: {
        select: {
          id: true,
          remoteLockId: true,
        },
      },
    },
  });
  // unit has no lock installed
  if (!unit?.Lock?.id) {
    return;
  }

  await generateReservationAccessCode(reservation, unit);
};
eventEmitter.on('reservationCreated', postReservationCreate);
