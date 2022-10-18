import { default as axios } from 'axios';
import { config } from '../config';

export const httpClient = axios.create({
  baseURL: config.host,
  timeout: 5 * 1e3,
});
