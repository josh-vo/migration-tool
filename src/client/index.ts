import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { getURL } from './util';
import { Auth } from '../type';

export class Client extends KintoneRestAPIClient {
  constructor(domain: string, auth: Auth) {
    const baseUrl = getURL(domain);
    super({ baseUrl, auth });
  }
}
