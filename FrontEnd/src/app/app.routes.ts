import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { UserRole } from './core/models/user.model';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(r => r.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./features/users/users.routes').then(r => r.USERS_ROUTES),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.ADMIN] }
  },
  {
    path: 'companies',
    loadChildren: () => import('./features/companies/companies.routes').then(r => r.COMPANIES_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes').then(r => r.PRODUCTS_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: '403',
    loadComponent: () => import('./shared/components/errors/forbidden/forbidden.component')
      .then(c => c.ForbiddenComponent)
  },
  {
    path: '404',
    loadComponent: () => import('./shared/components/errors/not-found/not-found.component')
      .then(c => c.NotFoundComponent)
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
