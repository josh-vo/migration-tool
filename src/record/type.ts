import { UpdateKey } from "../type";

export type GetRecord = {
  app: number;
  id: number;
};

export type AddRecord = {
  app: number;
  record?: object;
};

export type UpdateRecord = {
  app: number;
  id: number;
  record?: object;
  revision?: number;
} | {
  app: number;
  updateKey: UpdateKey;
  record?: object;
  revision?: number;
};

export type RecordType = {
  [fieldCode: string]: {
    type?: string;
    value: any;
  };
}

export type Row = {
  id: number;
  value: RecordType;
}
