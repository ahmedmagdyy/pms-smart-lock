import crypto from 'crypto';

export function encrypt(localKey: string, accessCode: string) {
  // encrypt the access code using aes-128-ecb using crypto
  const cipher = crypto.createCipheriv('aes-128-ecb', localKey, '');

  let encrypted = cipher.update(accessCode, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return encrypted;
}
