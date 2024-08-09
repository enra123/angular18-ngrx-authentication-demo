import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { hasPermissionGuard } from "@app/services/has-permission-guard.service";
import { authGuard } from "@app/services/auth-guard.service";
import { HomeComponent } from "@app/home/home.component";
import { DashboardComponent } from "@app/dashboard/dashboard.component";
import { RegisterComponent } from "@app/register/register.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  { path: 'register',
    component: RegisterComponent,
    canActivate: [authGuard(true)],
  },
  { path: 'login',
    component: LoginComponent,
    canActivate: [authGuard(true)],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [hasPermissionGuard("view")],
  },
];
