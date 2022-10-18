import { Reservation } from '@prisma/client';
import { eventEmitter } from '../../../events/eventEmitter';
import { prisma } from '../../../prismaClient';
import { generateReservationAccessCode } from '../../../helpers/reservationAccessCode';
import { deleteDoorLock } from '../../../helpers/deleteAccessCode';
import { generateAccesscode } from '../../../utils/generateAccesscode';

const postReservationUpdate = async (reservation: Reservation) => {
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

    await deleteDoorLock(accessCode.remotePasscodeId);
    await generateReservationAccessCode(
      reservation,
      unit,
      generateAccesscode()
    );
  } catch (error) {
    console.log(error);
  }
};
eventEmitter.on('reservationUpdated', postReservationUpdate);
