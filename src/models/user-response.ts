import { User } from "./user";

export interface UserResponse extends User {
  error: boolean,
  errorText: string,
}
