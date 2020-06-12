import { REQUESTING_EXCEPT_FIELDS } from './constant';
import { RecordType, Row } from './type';

const getField = (record: RecordType, fieldCode: string) => {
  return record[fieldCode];
}

const getRows = (record: RecordType, tableCode: string) => {
  return record[tableCode].value as Row[];
}

const removeField = (record: RecordType, fieldCode: string, tableCode?: string) => {
  if (typeof tableCode !== 'undefined' && Array.isArray(record[tableCode].value) === true) {
    const tableValue = record[tableCode].value as Row[];
    tableValue.forEach(row => row.value.hasOwnProperty(fieldCode) && delete row.value[fieldCode]);
  } else {
    delete record[fieldCode];
  }
}

const parseRecordForRequesting = (record: RecordType) => {
  let fieldCode;
  let fieldContent;

  for ([fieldCode, fieldContent] of Object.entries(record)) {
    if (typeof fieldContent.type !== 'undefined' && REQUESTING_EXCEPT_FIELDS.includes(fieldContent.type) === true) {
      removeField(record, fieldCode);
    }
    delete fieldContent.type;
  }
  return record;
};

export {
  getField,
  getRows,
  removeField,
  parseRecordForRequesting
};