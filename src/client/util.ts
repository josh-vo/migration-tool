import { CONNECTION } from './constant';

export const getURL = (domain: string) => {
  const urlFQDN = CONNECTION.SCHEMA + '://' + domain;
  return (typeof domain !== 'undefined' && !domain.match(/https/)) ? urlFQDN : domain;
};
