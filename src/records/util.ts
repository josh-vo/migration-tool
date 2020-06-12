import { FIELDS_TYPE_VALUE_IS_ARRAY } from './constant';
import { RecordType, Row } from '../record/type';

const mapFields = (record: RecordType, from: { [x: string]: any }, to: { [x: string]: any }) => {
  let newRecord: RecordType = {};
  let fromKey: string;
  let fromValue: any;

  for ([fromKey, fromValue] of Object.entries(from)) {
    const fromCode = (typeof fromValue.code !== 'undefined') ? fromValue.code : fromValue;
    const fromType = (typeof fromValue.type !== 'undefined') ? fromValue.type : undefined;

    const toCode = (typeof to[fromKey] !== 'undefined' && typeof to[fromKey].code !== 'undefined') ? to[fromKey].code : to[fromKey];
    const toType = (typeof to[fromKey] !== 'undefined' && typeof to[fromKey].type !== 'undefined') ? to[fromKey].type : undefined;

    const newKey = toCode;
    if (typeof newKey !== 'undefined') {
      record[fromCode].value = _mapFieldValueByType(record[fromCode].value, fromType, toType);
      newRecord = { ...newRecord, ...{ [newKey]: record[fromCode] } };
    }
  }
  return newRecord;
};

const mapFieldsInRowTable = (row: Row, from: { [x: string]: any }, to: { [x: string]: any }) => {
  let newRecord: RecordType = {};
  let fromKey: string;
  let fromValue: any;

  for ([fromKey, fromValue] of Object.entries(from)) {
    const fromCode = (typeof fromValue.code !== 'undefined') ? fromValue.code : fromValue;
    const fromType = (typeof fromValue.type !== 'undefined') ? fromValue.type : undefined;

    const toCode = (typeof to[fromKey] !== 'undefined' && typeof to[fromKey].code !== 'undefined') ? to[fromKey].code : to[fromKey];
    const toType = (typeof to[fromKey] !== 'undefined' && typeof to[fromKey].type !== 'undefined') ? to[fromKey].type : undefined;

    const newKey = toCode;
    if (typeof newKey !== 'undefined') {
      row.value[fromCode].value = _mapFieldValueByType(row.value[fromCode].value, fromType, toType);
      newRecord = { ...newRecord, ...{ [newKey]: row.value[fromCode] } };
    }
  }
  return newRecord;
};

const _mapFieldValueByType = (value: any, fromType: string, toType: string) => {
  const fromTypeIsArray = FIELDS_TYPE_VALUE_IS_ARRAY.includes(fromType);
  const toTypeIsArray = FIELDS_TYPE_VALUE_IS_ARRAY.includes(toType);

  let newValue = value;
  if (fromTypeIsArray === true && toTypeIsArray === false) {
    const values = (value as string[]);
    newValue = values.length > 0 ? values[0] : '';
  }

  return newValue;
};

export { mapFields, mapFieldsInRowTable };