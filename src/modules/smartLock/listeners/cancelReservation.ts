import { Reservation } from '@prisma/client';
import { eventEmitter } from '../../../events/eventEmitter';
import { deleteDoorLock } from '../../../helpers/deleteAccessCode';
import { prisma } from '../../../prismaClient';

const postReservationCancel = async (reservation: Reservation) => {
  try {
    // check if reservation has access code
    const accessCode = await prisma.accessCode.findFirst({
      where: {
        reservationId: reservation.id,
      },
    });
    if (!accessCode) {
      return;
    }

    const deleteLock = await deleteDoorLock(accessCode.remotePasscodeId);
    if (deleteLock.success) {
      // delete access code
      await prisma.accessCode.delete({
        where: {
          id: accessCode.id,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
eventEmitter.on('reservationCanceled', postReservationCancel);
