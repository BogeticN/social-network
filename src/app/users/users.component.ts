import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: Array<User> = [];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.usersService.getUsers().subscribe((res) => {
      for (let el of res) {
        const user = new User();

        user.id = el.id;
        user.firstName = el.firstName;
        user.surname = el.surname;

        this.users.push(user);
      }
    });
  }
}
