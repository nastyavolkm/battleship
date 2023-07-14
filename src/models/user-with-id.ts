import { User } from "./user";

export interface UserWithId extends User {
  id: number,
}
