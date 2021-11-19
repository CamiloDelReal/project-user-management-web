import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UsersService} from "../services/users.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  get isUserLoggedIn(): boolean {
    return this.usersService.isUserLoggedIn();
  }

  get isUserAdmin(): boolean {
    return this.usersService.isUserAdmin();
  }

  navigateToDetails() {
    this.router.navigate(['/users', this.usersService.getUserLoggedIn()?.id, 'details'], {
      relativeTo: this.route
    })
  }

  logout() {
    this.usersService.removeAuth()
    this.router.navigate(['/login'])
  }
}
