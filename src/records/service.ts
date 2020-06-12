import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { GetRecords, AddRecords, UpdateRecords, GetRecordsResponse } from './type';
import { RecordType } from '../record/type';

import { GET_RECORDS_LIMITATION } from '../records/constant';

const getRecords = async (client: KintoneRestAPIClient, params: GetRecords) => {
  if (typeof params.query !== 'undefined' &&
    (params.query.match(/limit\s+\d+/) !== null || params.query.match(/offset\s+\d+/) !== null)) {
    return await client.record.getRecords<RecordType>({
      app: params.app,
      fields: params.fields,
      query: params.query,
      totalCount: params.totalCount
    });
  }

  let count = 0;
  let offset = 0;
  const totalResponse: GetRecordsResponse = {
    records: [],
    totalCount: null
  };

  do {
    let query = (typeof params.query !== 'undefined') ? params.query : '';
    query += ` limit ${GET_RECORDS_LIMITATION} offset ${offset}`;

    const response = await client.record.getRecords<RecordType>({
      app: params.app,
      fields: params.fields,
      query,
      totalCount: params.totalCount
    });

    count = response.records.length;
    if (count === 0) {
      return totalResponse;
    }

    totalResponse.totalCount = response.totalCount;
    totalResponse.records = [...totalResponse.records, ...response.records];

    offset += GET_RECORDS_LIMITATION;
  } while (count > 0);

  return totalResponse;
};

const addRecords = async (client: KintoneRestAPIClient, params: AddRecords) => {
  return await client.record.addRecords(params);
};

const updateRecords = async (client: KintoneRestAPIClient, params: UpdateRecords) => {
  return await client.record.updateRecords(params);
};

export {
  getRecords,
  addRecords,
  updateRecords
};