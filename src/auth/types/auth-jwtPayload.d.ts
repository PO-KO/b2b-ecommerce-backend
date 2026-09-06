export type UserAuthData = {
  userId: string;
};

export type AuthJwtPayload = {
  sub: UserAuthData;
};
