import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { RecordType, GetRecord, AddRecord, UpdateRecord } from './type';

const getRecord = async (client: KintoneRestAPIClient, params: GetRecord) => {
  return await client.record.getRecord<RecordType>(params);
};

const addRecord = async (client: KintoneRestAPIClient, params: AddRecord) => {
  return await client.record.addRecord(params);
};

const updateRecord = async (client: KintoneRestAPIClient, params: UpdateRecord) => {
  return await client.record.updateRecord(params);
};

export {
  getRecord,
  addRecord,
  updateRecord
};