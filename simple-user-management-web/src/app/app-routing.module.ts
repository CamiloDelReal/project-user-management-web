import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LogInComponent} from "./log-in/log-in.component";
import {UsersComponent} from "./users/users.component";
import {UserDetailsComponent} from "./user-details/user-details.component";
import {UserEditComponent} from "./user-edit/user-edit.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {NotFoundComponent} from "./not-found/not-found.component";

const routes: Routes = [
  {
    path: '',
    component: LogInComponent
  },
  {
    path: 'login',
    component: LogInComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'users/:id/details',
    component: UserDetailsComponent
  },
  {
    path: 'users/:id/edit',
    component: UserEditComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
