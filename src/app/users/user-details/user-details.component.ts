import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user-details.component.html',
})
export class UserDetailsComponent implements OnInit {
  userId: number;
  users: Array<User> = [];
  currentUser: User | undefined;
  allFriends: Array<User> = [];
  allFriendsOfFriends: Array<User> = [];
  allSuggestedFriends: Array<User> = [];

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = +params.id;

      this.allFriends = [];
      this.allFriendsOfFriends = [];
      this.allSuggestedFriends = [];

      this.usersService.getUsers().subscribe((res) => {
        for (let el of res) {
          const user = new User();

          user.id = el.id;
          user.firstName = el.firstName;
          user.surname = el.surname;
          user.age = el.age;
          user.gender = el.gender;
          user.friends = el.friends;

          this.users.push(user);
          this.currentUser = this.users.find((el) => el.id === this.userId);
        }
        this.getFriends();
        this.getFriendsOfFriends();
        this.getSuggestedFriends();

        this.allFriendsOfFriends = [...new Set(this.allFriendsOfFriends)];
        this.allSuggestedFriends = [...new Set(this.allSuggestedFriends)];
      });
    });
  }

  getFriends(): void {
    if (this.currentUser) {
      this.currentUser.friends.forEach((friend) => {
        let userFriend = new User();

        userFriend = this.users.find((el) => el.id === friend) as User;

        if (userFriend) {
          this.allFriends.push(userFriend);
        }
      });
    }
  }

  getFriendsOfFriends(): void {
    if (this.currentUser) {
      this.allFriends.forEach((friend) => {
        friend.friends.forEach((f) => {
          let friendOfFriend = new User();

          friendOfFriend = this.users.find((el) => el.id === f) as User;

          if (
            friendOfFriend &&
            friendOfFriend.id !== this.currentUser?.id &&
            !this.currentUser?.friends.includes(friendOfFriend.id)
          ) {
            this.allFriendsOfFriends.push(friendOfFriend);
          }
        });
      });
    }
  }

  getSuggestedFriends(): void {
    this.allFriendsOfFriends.forEach((friend) => {
      let count = 0;

      for (let f of friend.friends) {
        if (this.currentUser)
          for (let fr of this.currentUser.friends) {
            if (f === fr && friend.id !== fr) {
              count++;
            }
            if (count === 2) {
              this.allSuggestedFriends.push(friend);
              count = 0;
            }
          }
      }
    });
  }

  onPersonClicked(id: number): void {
    this.router.navigate([`/users/${id}`], { relativeTo: this.route });
  }
}
