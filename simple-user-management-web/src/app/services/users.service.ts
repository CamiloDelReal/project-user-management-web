import {Injectable} from '@angular/core';
import {LoginResponse} from "./models/login-response";
import jwt_decode from "jwt-decode";
import {Role} from "./models/role";
import {UserLoggedIn} from "./models/userloggedin";
import {Observable} from "rxjs";
import {User} from "./models/user";
import {ClientService} from "./client.service";
import {UserRequest} from "./models/user-request";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private loginResponse: LoginResponse | null = null;
  private decodedToken: { [key: string]: string } | null = null;
  private user: UserLoggedIn | null = null;

  constructor(
    private clientService: ClientService
  ) {
    this.loginResponse = this.getAuth();
    if (this.loginResponse) {
      this.decodedToken = jwt_decode(this.loginResponse.token);
      const data = this.decodedToken ? this.decodedToken['sub'].split('--') : null
      if (data) {
        this.user = new UserLoggedIn(parseInt(data[0]), data[1]);
      }
    }
  }

  saveAuth(value: LoginResponse) {
    this.loginResponse = value;
    this.decodedToken = jwt_decode(this.loginResponse.token);
    localStorage.setItem('user_auth_token', JSON.stringify(value));
    const data = this.decodedToken ? this.decodedToken['sub'].split('--') : null
    if (data) {
      this.user = new UserLoggedIn(parseInt(data[0]), data[1]);
    }
  }

  private getAuth(): LoginResponse | null {
    const authData = localStorage.getItem('user_auth_token');
    if (authData) {
      return JSON.parse(authData);
    } else {
      return null;
    }
  }

  removeAuth() {
    localStorage.removeItem('user_auth_token');
    this.loginResponse = null;
    this.decodedToken = null;
    this.user = null;
  }

  isUserLoggedIn(): boolean {
    return this.user != null;
  }

  getUserLoggedIn(): UserLoggedIn | null {
    return this.user;
  }

  isUserAdmin(): boolean {
    const roles = this.decodedToken ? this.decodedToken['authorities'].split('--') : [];
    return roles.find(it => it == Role.ADMINISTRATOR) != undefined;
  }

  getExpiryTime(): string | null {
    return this.decodedToken ? this.decodedToken['exp'] : null;
  }

  getAuthToken(): string | undefined {
    return this.loginResponse?.token;
  }

  getAuthTokenType(): string | undefined {
     return this.loginResponse?.tokenType;
  }

  isTokenExpired(): boolean {
    if (this.getExpiryTime()) {
      const expiryTime: number = parseInt(this.getExpiryTime()!);
      if (expiryTime) {
        return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  getUsers(): Observable<User[]> {
    return this.clientService.getRequest('/users');
  }

  readUser(id: number): Observable<User> {
    return this.clientService.getRequest(`/users/${id}`);
  }

  createUser(user: UserRequest): Observable<User> {
    return this.clientService.postRequest('/users', user)
  }

  updateUser(user: UserRequest): Observable<User> {
    return this.clientService.putRequest(`/users/${user.id}`, user)
  }

  deleteUser(id: number): Observable<any> {
    return this.clientService.deleteRequest(`/users/${id}`)
  }

}
