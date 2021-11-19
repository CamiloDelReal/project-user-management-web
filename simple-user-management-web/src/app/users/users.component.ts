import { Component, OnInit } from '@angular/core';
import {UsersService} from "../services/users.service";
import {User} from "../services/models/user";
import {ConfirmDeleteComponent} from "../confirm-delete/confirm-delete.component";
import {MatDialog} from "@angular/material/dialog";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'roles', 'options'];
  dataSource: User[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private usersService: UsersService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading = true
    this.loadUsers()
  }

  private loadUsers() {
    this.usersService.getUsers().subscribe({
        next: users => {
          this.dataSource = users;
          this.loading = false;
        },
        error: error => {
          console.error(error);
          this.loading = false;
          this.error = 'Error loading users data';
        }
      }
    )
  }

  tryAgain() {
    this.loadUsers()
  }

  deleteUser(userId: number) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result == true) {
        this.usersService.deleteUser(userId).subscribe({
          next: () => {
            console.log("User deleted")
            this.loadUsers()
          },
          error: (error: HttpErrorResponse) => {
            console.error(error)
          }
        })
      }
    });
  }
}
