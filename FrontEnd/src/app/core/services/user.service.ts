import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpBaseService } from './http-base.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends HttpBaseService {
  constructor(protected override http: HttpClient) {
    super(http);
  }

  async getUsers(): Promise<User[]> {
    return this.get<User[]>('users');
  }

  async getUserById(id: number): Promise<User> {
    return this.get<User>(`users/${id}`);
  }

  async createUser(user: User): Promise<User> {
    return this.post<User>('users', user);
  }

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    return this.patch<User>(`users/${id}`, user);
  }

  async deleteUser(id: number): Promise<void> {
    return this.delete<void>(`users/${id}`);
  }
}
