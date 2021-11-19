import {Injectable} from '@angular/core';
import {ClientService} from "./client.service";
import {LoginRequest} from "./models/login-request";
import {Observable} from "rxjs";
import {LoginResponse} from "./models/login-response";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private clientService: ClientService
  ) { }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.clientService.postRequest('/users/login', loginRequest);
  }

}
