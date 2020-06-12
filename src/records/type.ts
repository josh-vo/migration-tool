import { RecordType } from "../record/type";
import { UpdateKey } from "../type";

export type GetRecords = {
  app: number;
  fields?: string[];
  query?: string;
  totalCount?: boolean;
};

export type AddRecords = {
  app: number;
  records: RecordType[];
}

export type UpdateRecords = {
  app: number;
  records: Array<{
    id: number;
    record?: object;
    revision?: number;
  } | {
    updateKey: UpdateKey;
    record?: object;
    revision?: number;
  }>;
};

export type GetRecordsResponse = {
  records: RecordType[];
  totalCount: string | null;
};
