import 'dotenv/config';
// import * as qs from 'qs';
import * as crypto from 'crypto';
import { default as axios } from 'axios';

let token = '';

const config = {
  /* openapi host */
  host: 'https://openapi.tuyacn.com',
  /* fetch from openapi platform */
  accessKey: process.env.CLIENTID as string,
  /* fetch from openapi platform */
  secretKey: process.env.CLIENTSECRET as string,
  /* Interface example device_ID */
  deviceId: process.env.DEVICE_ID as string,
};

const httpClient = axios.create({
  baseURL: config.host,
  timeout: 5 * 1e3,
});

async function main() {
  await getToken();
  // const data = await getDeviceInfo(config.deviceId);
  // console.log('fetch success: ', JSON.stringify(data));
}

/**
 * fetch highway login token
 */
async function getToken() {
  const method = 'GET';
  const timestamp = Date.now().toString();
  const signUrl = '/v1.0/token?grant_type=1';
  const contentHash = crypto.createHash('sha256').update('').digest('hex');
  const stringToSign = [method, contentHash, '', signUrl].join('\n');
  const signStr = config.accessKey + timestamp + stringToSign;

  const headers = {
    t: timestamp,
    sign_method: 'HMAC-SHA256',
    client_id: config.accessKey,
    sign: await encryptStr(signStr, config.secretKey),
  };
  const { data: login } = await httpClient.get('/v1.0/token?grant_type=1', {
    headers,
  });
  if (!login || !login.success) {
    throw Error(`fetch failed: ${login.msg}`);
  }
  token = login.result.access_token;
}

/**
 * fetch highway business data
 */
// async function getDeviceInfo(deviceId: string) {
//   const query = {};
//   const method = 'POST';
//   const url = `/v1.0/devices/${deviceId}/commands`;
//   const reqHeaders: { [k: string]: string } = await getRequestSign(url, method, {}, query);

//   const { data } = await httpClient.request({
//     method,
//     data: {},
//     params: {},
//     headers: reqHeaders,
//     url: reqHeaders.path,
//   });
//   if (!data || !data.success) {
//     throw Error(`request api failed: ${data.msg}`);
//   }
// }

/**
 * HMAC-SHA256 crypto function
 */
async function encryptStr(str: string, secret: string): Promise<string> {
  return crypto
    .createHmac('sha256', secret)
    .update(str, 'utf8')
    .digest('hex')
    .toUpperCase();
}

/**
 * request sign, save headers
 * @param path
 * @param method
 * @param headers
 * @param query
 * @param body
 */
// async function getRequestSign(
//   path: string,
//   method: string,
//   headers: { [k: string]: string } = {},
//   query: { [k: string]: any } = {},
//   body: { [k: string]: any } = {},
// ) {
//   const t = Date.now().toString();
//   const [uri, pathQuery] = path.split('?');
//   const queryMerged = Object.assign(query, qs.parse(pathQuery));
//   const sortedQuery: { [k: string]: string } = {};
//   Object.keys(queryMerged)
//     .sort()
//     .forEach((i) => (sortedQuery[i] = query[i]));

//   const querystring = decodeURIComponent(qs.stringify(sortedQuery));
//   const url = querystring ? `${uri}?${querystring}` : uri;
//   const contentHash = crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex');
//   const stringToSign = [method, contentHash, '', url].join('\n');
//   const signStr = config.accessKey + token + t + stringToSign;
//   return {
//     t,
//     path: url,
//     client_id: config.accessKey,
//     sign: await encryptStr(signStr, config.secretKey),
//     sign_method: 'HMAC-SHA256',
//     access_token: token,
//   };
// }

main().catch((err) => {
  throw Error(`error: ${err}`);
});
