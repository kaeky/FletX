import { Routes } from '@angular/router';

export const COMPANIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./company-list/company-list.component').then(c => c.CompanyListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./company-form/company-form.component').then(c => c.CompanyFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./company-form/company-form.component').then(c => c.CompanyFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./company-detail/company-detail.component').then(c => c.CompanyDetailComponent)
  }
];
