import { config } from '../config';
import { httpClient } from './httpClient';

export const getLocalKey = async () => {
  const { data } = await httpClient.get(`/v1.0/devices/${config.deviceId}`);

  return data.result?.local_key;
};
