export interface ILoginResponse {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  dependence: string;
  roles: string[];
  status: string;
  isPasswordChanged: boolean;
}
