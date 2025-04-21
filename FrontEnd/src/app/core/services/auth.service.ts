import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import { AuthResponse, LoginCredentials, RegisterData } from '../models/auth.model';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends HttpBaseService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenExpirationTimer: any;

  constructor(
    protected override http: HttpClient,
    private router: Router
  ) {
    super(http);
    this.checkToken();
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('auth/login', credentials);
    this.handleAuthentication(response);
    return response;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('auth/register', userData);
    this.handleAuthentication(response);
    return response;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiration');

    this.currentUserSubject.next(null);

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): string | null | undefined{
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded: any = jwt_decode.jwtDecode(token);
      const expirationDate = new Date(decoded.exp * 1000);
      return expirationDate < new Date();
    } catch (error) {
      return true;
    }
  }

  private handleAuthentication(response: AuthResponse): void {
    const { access_token, user } = response;

    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));

    this.currentUserSubject.next(user);

    // Auto logout after token expires
    try {
      const decoded: any = jwt_decode.jwtDecode(access_token);
      const expirationDate = new Date(decoded.exp * 1000);

      const expiresIn = expirationDate.getTime() - new Date().getTime();
      localStorage.setItem('tokenExpiration', expirationDate.toISOString());

      this.autoLogout(expiresIn);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  private checkToken(): void {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    const expirationTime = localStorage.getItem('tokenExpiration');

    if (!token || !userJson || !expirationTime) {
      return;
    }

    const expirationDate = new Date(expirationTime);
    const now = new Date();

    if (expirationDate <= now) {
      this.logout();
      return;
    }

    const user = JSON.parse(userJson);
    this.currentUserSubject.next(user);

    const expiresIn = expirationDate.getTime() - now.getTime();
    this.autoLogout(expiresIn);
  }

  private autoLogout(expiresIn: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expiresIn);
  }
}
