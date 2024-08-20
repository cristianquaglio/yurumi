import { UserRoles } from '../constants';

export interface UserDto {
  _id: string;
  email: string;
  password: string;
  organization: string;
  roles: UserRoles[];
}
