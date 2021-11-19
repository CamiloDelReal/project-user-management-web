import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../services/models/user";
import {ActivatedRoute, Router} from "@angular/router";
import {UsersService} from "../services/users.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {Role} from "../services/models/role";
import {UserRequest} from "../services/models/user-request";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {
  selectedUserId: number = 0;
  userForm: FormGroup;
  error: string | null = null;
  success: boolean = false;
  loading: boolean = false;
  routeParamsSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      role: [false]
    })
  }

  ngOnInit(): void {
    this.routeParamsSubscription = this.route.params.subscribe((data) => {
      if(data['id']) {
        this.selectedUserId = data['id'];
        this.loadUserData(this.selectedUserId);
      } else {
        if(!this.usersService.isUserAdmin()) {
          this.userForm.controls['role'].disable()
        }
      }
    })
  }

  private loadUserData(id: number) {
    this.loading = true;
    this.userForm.disable()
    this.usersService.readUser(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({ 'firstName': user.firstName })
        this.userForm.patchValue( { 'lastName': user.lastName })
        this.userForm.patchValue({ 'email': user.email })
        this.userForm.patchValue({ 'role': user.roles?.find((r) => r.name === Role.ADMINISTRATOR) != undefined })
        this.userForm.enable()
        if(!this.usersService.isUserAdmin()) {
          this.userForm.controls['role'].disable()
        }
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        if(error.status == HttpStatusCode.Unauthorized || error.status == HttpStatusCode.Forbidden) {
          this.error = 'Insufficient credentials access level';
        } else {
          this.error = 'Error loading user data';
        }
        this.loading = false;
      }
    })
  }

  save() {
    this.success = false;
    this.error = null;
    if(this.userForm.valid) {
      this.loading = true;
      this.userForm.disable()
      const user = new UserRequest()
      user.id = this.selectedUserId;
      user.firstName = this.userForm.controls['firstName'].value;
      user.lastName = this.userForm.controls['lastName'].value;
      user.email = this.userForm.controls['email'].value;
      user.password = this.userForm.controls['password'].value;
      if(this.userForm.controls['role'].value == true) {
        user.roles = [Role.ADMINISTRATOR];
      } else {
        user.roles = [Role.GUEST];
      }
      if(this.selectedUserId != 0) {
        this.usersService.updateUser(user).subscribe({
          next: (data) => {
            this.userForm.enable()
            if (!this.usersService.isUserAdmin()) {
              this.userForm.controls['role'].disable()
            }
            this.loading = false;
            this.success = true;
            if (this.usersService.getUserLoggedIn()?.id == this.selectedUserId) {
              this.usersService.removeAuth()
              this.router.navigate(['login'], {queryParams: {reason: 'Authentication is required after the logged in user has changed data'}});
            }
          },
          error: (error: HttpErrorResponse) => {
            this.error = 'Error saving data';
            this.userForm.enable()
            if (!this.usersService.isUserAdmin()) {
              this.userForm.controls['role'].disable()
            }
            this.loading = false;
          }
        })
      } else {
        this.usersService.createUser(user).subscribe({
          next: (data) => {
            this.router.navigate(['users'])
          },
          error: (error: HttpErrorResponse) => {
            this.error = 'Error saving data';
            this.userForm.enable()
            if (!this.usersService.isUserAdmin()) {
              this.userForm.controls['role'].disable()
            }
            this.loading = false;
          }
        })
      }
    } else {
      this.error = 'Fill the field with a valid email and password';
    }
  }

  tryAgain() {
    this.loadUserData(this.selectedUserId);
  }

  ngOnDestroy(): void {
    if(this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
  }

}
