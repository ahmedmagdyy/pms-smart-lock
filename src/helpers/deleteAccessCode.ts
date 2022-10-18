import { config } from '../config';
import { httpClient } from './httpClient';

export const deleteDoorLock = async (
  passwordId: string
): Promise<{
  success: boolean;
  t: EpochTimeStamp;
  result: boolean;
}> => {
  try {
    const deleteTuyaPassword = await httpClient.get(
      `/v1.0/devices/${config.deviceId}/door-lock/temp-passwords/${Number(
        passwordId
      )}`
    );

    return deleteTuyaPassword.data;
  } catch (error) {
    console.log("couldn't delete password", error);
    // retry deleting password
    return deleteDoorLock(passwordId);
  }
};
