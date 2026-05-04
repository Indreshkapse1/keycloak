import { Session, User } from "next-auth";

export interface UserRoles {
  realm: string[];
  [clientId: string]: string[];
}

export interface UserWithRoles extends User {
  roles?: UserRoles;
}

export interface SessionWithRoles extends Omit<Session, "user"> {
  user: UserWithRoles;
}
