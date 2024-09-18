import { UserRoles } from '../constants';

export interface UserDto {
  _id: string;
  email: string;
  dependence: string;
  roles: UserRoles[];
}
