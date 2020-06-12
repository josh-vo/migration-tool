import { AddRecord, UpdateRecord } from '../record/type';
import { AddRecords, UpdateRecords } from '../records/type';

export type BulkRequestItem = {
  method: string;
  api: string;
  payload: AddRecord | UpdateRecord | AddRecords | UpdateRecords;
}

export type BulkRequest = {
  requests: BulkRequestItem[];
}