import { RecordUtil } from '../record';
import { getRecord, addRecord, updateRecord } from '../record/service';
import { getRecords } from '../records/service';
import { Client } from '../client';
import { MigrationBulkRequest } from './MigrationBulkRequest';

import { AddRecord, UpdateRecord, RecordType, GetRecord } from '../record/type';
import { AddRecords, UpdateRecords, GetRecords } from '../records/type';
import { Auth } from '../type';

type RequestParams = AddRecord | UpdateRecord | AddRecords | UpdateRecords | GetRecord | GetRecords;
type CallbackResponse = RequestParams | void;

export class Migration {
  private _self: Migration;
  private _plan: () => Promise<any>;
  private _bulkRequest: MigrationBulkRequest;
  private _requestParams?: RequestParams;

  constructor(domain: string = '', auth: Auth = { apiToken: '' }) {
    this._bulkRequest = new MigrationBulkRequest(domain, auth);

    this._plan = () => Promise.resolve();
    this._self = this;
  }

  public reset() {
    this._bulkRequest = new MigrationBulkRequest('', { apiToken: '' });
    this._plan = () => Promise.resolve();
    return this._self;
  }

  public record<T extends RecordType>(callback: (params: T) => CallbackResponse | Promise<CallbackResponse>, params?: GetRecord) {
    return {
      from: (domain: string, auth: Auth) => {
        const client = new Client(domain, auth);
        this._stage(() => this._getRecordWithCallback<T>(client, params || this._requestParams as GetRecord, callback));
        return this._self;
      }
    };
  }

  public records<T extends RecordType>(callback: (params: T[]) => CallbackResponse | Promise<CallbackResponse>, params?: GetRecords) {
    return {
      from: (domain: string, auth: Auth) => {
        const client = new Client(domain, auth);
        this._stage(() => this._getRecordsWithCallback<T>(client, params || this._requestParams as GetRecords, callback));
        return this._self;
      }
    };
  }

  public with(callback: () => CallbackResponse | Promise<CallbackResponse>) {
    this._stage(() => this._with(callback));
    return this._self;
  }

  public to(domain: string, auth: Auth) {
    const client = new Client(domain, auth);
    this._stage(() => this._to(client));
    return this._self;
  }

  public setBulkRequest(domain: string, auth: Auth) {
    this._bulkRequest = new MigrationBulkRequest(domain, auth);
    return this._self;
  }

  public addToBulkRequest() {
    this._stage(() => this._addBulkRequest());
    return this._self;
  }

  public commitBulkRequest() {
    this._stage(() => this._bulkRequest.commit());
    return this._self;
  }

  public async run() {
    return await this._plan();
  }

  private async _with(callback: () => CallbackResponse | Promise<CallbackResponse>) {
    const requestParams = await callback();
    this._requestParams = this._getRequestParams(requestParams);
  }

  private _stage(callback: () => Promise<any>) {
    this._plan = ((prev: () => Promise<any>) => () => prev().then(callback))(this._plan);
  }

  private async _getRecordWithCallback<T extends RecordType>(
    client: Client, params: GetRecord, callback: (params: T) => CallbackResponse | Promise<CallbackResponse>) {
    const response = await getRecord(client, params);

    const requestParams = await callback(response.record as T);
    this._requestParams = this._getRequestParams(requestParams);
  }

  private async _getRecordsWithCallback<T extends RecordType>(
    client: Client, params: GetRecords, callback: (params: T[]) => CallbackResponse | Promise<CallbackResponse>) {
    const response = await getRecords(client, params);

    const requestParams = await callback(response.records as T[]);

    this._requestParams = this._getRequestParams(requestParams);
  }

  private async _to(client: Client) {
    let response;
    if (typeof this._requestParams === 'undefined') {
      return response
    }
    const type = this._getType(this._requestParams);

    switch (type) {
      case 'UpdateRecord':
        response = await updateRecord(client, this._requestParams as UpdateRecord);
        break;
      case 'AddRecord':
        response = await addRecord(client, this._requestParams as AddRecord);
        break;
    }

    return response;
  }

  private _getRequestParams(requestParams: CallbackResponse) {
    if (typeof requestParams === 'undefined') {
      return undefined;
    }

    const type = this._getType(requestParams);

    switch (type) {
      case 'AddRecord':
      case 'UpdateRecord':
        const newRecordRequestParams = requestParams as AddRecord | UpdateRecord;
        newRecordRequestParams.record = RecordUtil.parseRecordForRequesting(newRecordRequestParams.record as RecordType);
        requestParams = newRecordRequestParams;
        break;
      case 'AddRecords':
        const addRecordsRequestParams = requestParams as AddRecords;
        addRecordsRequestParams.records = (addRecordsRequestParams as AddRecords).records.map(record => {
          return RecordUtil.parseRecordForRequesting(record as RecordType);
        });
        requestParams = addRecordsRequestParams;
        break;
      case 'UpdateRecords':
        const newRecordsRequestParams = requestParams as UpdateRecords;
        newRecordsRequestParams.records = (newRecordsRequestParams as UpdateRecords).records.map(item => {
          item.record = RecordUtil.parseRecordForRequesting(item.record as RecordType);
          return item;
        });
        requestParams = newRecordsRequestParams;
        break;
    }

    return requestParams;
  }

  private async _addBulkRequest() {
    if (typeof this._requestParams !== 'undefined') {
      const type = this._getType(this._requestParams);

      switch (type) {
        case 'AddRecord':
          this._bulkRequest.addRecord(this._requestParams as AddRecord);
          break;
        case 'UpdateRecord':
          this._bulkRequest.updateRecord(this._requestParams as UpdateRecord);
          break;
        case 'AddRecords':
          this._bulkRequest.addRecords(this._requestParams as AddRecords);
          break
        case 'UpdateRecords':
          this._bulkRequest.updateRecords(this._requestParams as UpdateRecords);
          break
      }
    }
  }

  private _getType(object: AddRecord | UpdateRecord | AddRecords | UpdateRecords) {
    if (object.hasOwnProperty('record')) {
      const newObject = object as AddRecord | UpdateRecord;
      if (this._isUpdateRecordType(newObject) === true) {
        return 'UpdateRecord';
      }
      return 'AddRecord';
    } else if (object.hasOwnProperty('records')) {
      const newObject = object as AddRecords | UpdateRecords;
      if (this._isUpdateRecordsType(newObject) === true) {
        return 'UpdateRecords';
      }
      return 'AddRecords';
    }
    return '';
  }

  private _isUpdateRecordType(object: AddRecord | UpdateRecord): object is UpdateRecord {
    return typeof object.record !== 'undefined'
      && (object.hasOwnProperty('id') === true || object.hasOwnProperty('updateKey') === true);
  }

  private _isUpdateRecordsType(object: AddRecords | UpdateRecords): object is UpdateRecords {
    return typeof object.records !== 'undefined'
      && object.records.every((record: object) => record.hasOwnProperty('id') === true || record.hasOwnProperty('updateKey') === true);
  }
}
