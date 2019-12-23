export interface AccessTokenPayload {
  sub: string;
  username: string;
  'x-hasura-claims': JwtHasuraClaims;
}

export interface JwtHasuraClaims {
  'x-hasura-allowed-roles': AllowedRolesString[];
  'x-hasura-default-role': AllowedRolesString;
  'x-hasura-user-id': string;
  'x-hasura-role': AllowedRolesString;
}

export type AllowedRolesString = keyof typeof AllowedRoles;

export declare enum AllowedRoles {
  admin = 'admin',
  user = 'user',
  anon = 'anon',
}
