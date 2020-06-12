import { commitBulkRequest } from '../bulkRequest/service';
import { Client } from '../client';
import { REQUEST_METHOD, REQUEST_LIMITATION, REQUEST_API } from '../bulkRequest/constant';
import { BulkRequest, BulkRequestItem } from '../bulkRequest/type';
import { Auth } from '../type';
import { UpdateRecord, AddRecord } from '../record/type';
import { AddRecords, UpdateRecords } from '../records/type';

export class MigrationBulkRequest {
  private _bulkRequest: BulkRequest;
  private _client: Client;

  constructor(domain: string, auth: Auth) {
    this._client = new Client(domain, auth);
    this._bulkRequest = {
      requests: []
    };
  }

  public addRecord(params: AddRecord) {
    if (this._validateNumberOfRequests() === false) {
      return this._bulkRequest;
    }

    const bulkRequestItem: BulkRequestItem = {
      method: REQUEST_METHOD.ADD,
      api: REQUEST_API.RECORD,
      payload: params
    };

    this._bulkRequest.requests.push(bulkRequestItem);

    return this;
  }

  public addRecords(params: AddRecords) {
    if (this._validateNumberOfRequests() === false) {
      return this._bulkRequest;
    }

    const bulkRequestItem: BulkRequestItem = {
      method: REQUEST_METHOD.ADD,
      api: REQUEST_API.RECORDS,
      payload: params
    };

    this._bulkRequest.requests.push(bulkRequestItem);

    return this;
  }

  public updateRecord(params: UpdateRecord) {
    if (this._validateNumberOfRequests() === false) {
      return this._bulkRequest;
    }

    const bulkRequestItem: BulkRequestItem = {
      method: REQUEST_METHOD.UPDATE,
      api: REQUEST_API.RECORD,
      payload: params
    };

    this._bulkRequest.requests.push(bulkRequestItem);

    return this;
  }

  public updateRecords(params: UpdateRecords) {
    if (this._validateNumberOfRequests() === false) {
      return this._bulkRequest;
    }

    const bulkRequestItem: BulkRequestItem = {
      method: REQUEST_METHOD.UPDATE,
      api: REQUEST_API.RECORDS,
      payload: params
    };

    this._bulkRequest.requests.push(bulkRequestItem);

    return this;
  }

  public async commit() {
    if (typeof this._client === 'undefined') {
      throw new Error('Client is required.');
    }

    if (this._bulkRequest.requests.length > 0) {
      return await commitBulkRequest(this._client, this._bulkRequest);
    }
  }

  private _validateNumberOfRequests(): boolean {
    return (this._bulkRequest.requests.length <= REQUEST_LIMITATION);
  };
}
