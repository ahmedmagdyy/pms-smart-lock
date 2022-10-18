import { config } from '../config';
import { httpClient } from './httpClient';

export const generateDoorLock = async (
  password: string,
  checkIn: Date,
  checkOut: Date
): Promise<{
  success: true;
  t: EpochTimeStamp;
  result: {
    id: bigint;
  };
}> => {
  try {
    const createTuyaPassword = await httpClient.post(
      `/v1.0/devices/${config.deviceId}/door-lock/temp-password`,
      {
        password,
        // password_type: 'ticket',
        // ticket_id: 'xxxxxx',
        effective_time: new Date(checkIn).getTime(),
        invalid_time: new Date(checkOut).getTime(),
      }
    );

    return createTuyaPassword.data;
  } catch (error) {
    console.log("couldn't create password", error);
    return generateDoorLock(password, checkIn, checkOut);
  }
};
