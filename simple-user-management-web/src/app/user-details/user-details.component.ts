import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../services/models/user";
import {UsersService} from "../services/users.service";
import {ConfirmDeleteComponent} from "../confirm-delete/confirm-delete.component";
import {MatDialog} from "@angular/material/dialog";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  user: User = new User()
  lastUserId: number = 0;
  loading: boolean = false;
  error: string | null = null;
  routeParamSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.routeParamSubscription = this.route.params.subscribe((data) => {
      this.lastUserId = data['id'];
      this.loadUser(this.lastUserId);
    })
  }

  ngOnDestroy(): void {
    if(this.routeParamSubscription) {
      this.routeParamSubscription.unsubscribe()
    }
  }

  private loadUser(id: number) {
    this.loading = true
    this.usersService.readUser(id)
      .subscribe({
        next: (user) => {
          this.user = user;
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

  deleteUser() {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result == true) {
        this.usersService.deleteUser(this.lastUserId).subscribe({
          next: () => {
            console.log("User deleted")
            if(this.usersService.getUserLoggedIn()?.id == this.lastUserId) {
              this.usersService.removeAuth()
              this.router.navigate(['login'], { queryParams : { reason: 'Authentication is required after the logged in user has been deleted' }});
            }
          },
          error: (error: HttpErrorResponse) => {
            console.error(error)
          }
        })
      }
    });
  }

  tryAgain() {
    this.loadUser(this.lastUserId)
  }

  edit() {
    this.router.navigate(['users', this.lastUserId, 'edit'])
  }
}
