export class UserRequest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[] | null;

  constructor() {
    this.id = 0;
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
    this.roles = null;
  }
}
