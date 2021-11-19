import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoginService} from "../services/login.service";
import {LoginRequest} from "../services/models/login-request";
import {ActivatedRoute, Router} from "@angular/router";
import {UsersService} from "../services/users.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit, OnDestroy {
  loginForm: FormGroup
  loading: boolean = false
  error: string | null = null
  routeParamsSubscription: Subscription | undefined;

  constructor(
    private loginService: LoginService,
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    this.routeParamsSubscription = this.route.queryParams.subscribe((data) => {
      const reason = data['reason'];
      if(reason) {
        this.error = reason;
      }
    })
  }

  ngOnDestroy(): void {
    if(this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
  }

  login() {
    if(this.loginForm.valid) {
      this.loading = true
      this.loginForm.disable()
      const request = new LoginRequest(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value);
      this.loginService.login(request)
        .subscribe({
          next: loginResponse => {
            this.loading = false;
            this.usersService.saveAuth(loginResponse);
            if (this.usersService.isUserAdmin()) {
              this.router.navigate(['/users'])
            } else {
              this.router.navigate(['/users', this.usersService.getUserLoggedIn()?.id, 'details'])
            }
          },
          error: error => {
            this.loading = false
            this.loginForm.enable()
            switch (error.status) {
              case 404:
                this.error = 'Backend service is down';
                break;
              case 401:
                this.error = 'Authentication failed';
                break;
              default:
                this.error = 'Unknown error';
            }
          }
        })
    } else {
      this.error = 'Fill the field with a valid email and password';
    }
  }

  createUser() {
    this.router.navigate(['/users/create'])
  }
}
