import { Reservation } from '@prisma/client';
import { config } from '../config';
import { prisma } from '../prismaClient';
import { encrypt } from '../utils/encryptPasscode';
import { generateAccesscode } from '../utils/generateAccesscode';
import { generateDoorLock } from './generateDoorLock';
import { getLocalKey } from './getLocalKey';
import { getTokenByRefreshToken, getTokenFromTuyaAPI } from './getToken';

export const generateReservationAccessCode = async (
  reservation: Reservation,
  unit: any,
  accesscode?: any
) => {
  try {
    //generate 6 digit access code
    if (!accesscode) {
      accesscode = generateAccesscode();
    }
    console.log('accessCode', accesscode);
    console.log('reservation', reservation);

    let token = await prisma.token.findFirst({
      where: {
        deviceId: config.deviceId,
      },
    });
    if (!token) {
      token = await getTokenFromTuyaAPI();
    }
    if (token.expiresAt < new Date()) {
      token = await getTokenByRefreshToken(token.refreshToken);
    }

    // get local key
    const localKey = await getLocalKey();

    const encryptedAccessCode = encrypt(localKey, accesscode);

    const passcodeCreated = await generateDoorLock(
      encryptedAccessCode,
      reservation.checkIn,
      reservation.checkOut
    );

    if (passcodeCreated.success) {
      await prisma.accessCode.create({
        data: {
          reservationId: reservation.id,
          unitId: reservation.unitId,
          lockId: unit.Lock.id,
          passcode: accesscode,
          remotePasscodeId: passcodeCreated.result.id.toString(),
        },
      });
    }
  } catch (error) {
    console.log('error generating access code', error);
  }
};
