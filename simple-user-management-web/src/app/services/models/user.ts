import {Role} from "./role";

export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles: Role[] | null;

  constructor() {
    this.id = 0;
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.roles = null;
  }
}
