const REQUEST_LIMITATION = 20;

const REQUEST_METHOD = {
  GET: 'GET',
  ADD: 'POST',
  UPDATE: 'PUT',
  DELETE: 'DELETE'
};

const REQUEST_API = {
  RECORDS: '/k/v1/records.json',
  RECORD: '/k/v1/record.json',
}

export {
  REQUEST_LIMITATION,
  REQUEST_METHOD,
  REQUEST_API
};