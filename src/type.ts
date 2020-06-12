export type PasswordAuth = {
  username: string;
  password: string;
}

export type APITokenAuth = {
  apiToken: string;
}

export type Auth = PasswordAuth | APITokenAuth;

export type UpdateKey = {
  field: string;
  value: string | number;
};
