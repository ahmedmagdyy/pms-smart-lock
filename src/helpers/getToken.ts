import * as crypto from 'crypto';
import { config } from '../config';
import { prisma } from '../prismaClient';
import { httpClient } from './httpClient';

async function encryptStr(str: string, secret: string): Promise<string> {
  return crypto
    .createHmac('sha256', secret)
    .update(str, 'utf8')
    .digest('hex')
    .toUpperCase();
}

export async function getTokenFromTuyaAPI() {
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
  const saveToken = await prisma.token.create({
    data: {
      deviceId: config.deviceId,
      token: login.result.access_token,
      expiresAt: login.result.expire_time,
      refreshToken: login.result.refresh_token,
    },
  });
  return saveToken;
}

export async function getTokenByRefreshToken(refreshToken: string) {
  const { data } = await httpClient.get(`/v1.0/token/${refreshToken}`);
  if (!data || !data.success) {
    throw Error(`fetch failed: ${data.msg}`);
  }
  const saveToken = await prisma.token.create({
    data: {
      deviceId: config.deviceId,
      token: data.result.access_token,
      expiresAt: data.result.expire_time,
      refreshToken: data.result.refresh_token,
    },
  });
  return saveToken;
}
