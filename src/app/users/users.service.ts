import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  allUsers: Array<User> = [];

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get('assets/data.json');
  }
}
