import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { BulkRequest } from './type'
const commitBulkRequest = async (client: KintoneRestAPIClient, bulkRequest: BulkRequest) => {
  return await client.bulkRequest(bulkRequest);
};

export {
  commitBulkRequest
};