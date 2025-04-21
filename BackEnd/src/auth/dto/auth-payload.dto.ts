export class AuthPayloadDto {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export class AuthUserDto {
  id: string;
  email: string;
  role: string;
}
