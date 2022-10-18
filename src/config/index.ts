export const config = {
  /* openapi host */
  host: process.env.TUYA_API_URL,
  /* fetch from openapi platform */
  accessKey: process.env.CLIENTID,
  /* fetch from openapi platform */
  secretKey: process.env.CLIENTSECRET as string,
  /* Interface example device_ID */
  deviceId: process.env.DEVICE_ID as string,
};
