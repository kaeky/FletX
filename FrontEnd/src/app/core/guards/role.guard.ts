import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // First check if user is authenticated
    if (!this.authService.isAuthenticated() || this.authService.isTokenExpired()) {
      this.authService.logout();
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    // Check if route has required roles
    const requiredRoles = route.data['roles'] as Array<string>;

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required
    }

    // Check if user has any of the required roles
    const userRole = this.authService.getUserRole();

    if (!userRole || !requiredRoles.includes(userRole)) {
      this.router.navigate(['/403']); // Forbidden
      return false;
    }

    return true;
  }
}
