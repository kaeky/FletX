import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-list/user-list.component').then(c => c.UserListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./user-form/user-form.component').then(c => c.UserFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./user-form/user-form.component').then(c => c.UserFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./user-detail/user-detail.component').then(c => c.UserDetailComponent)
  }
];
