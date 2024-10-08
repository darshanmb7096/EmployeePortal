import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { EmployeeComponent } from './employee/employee.component';
import { AuthGuard } from './auth.guard';
import { DepartmentComponent } from './department/department.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
    { path: 'dashBoard', component: HomeComponent,canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'employees', component: EmployeeComponent, canActivate: [AuthGuard] },
  {path:'department',component:DepartmentComponent,canActivate: [AuthGuard]},
  { path: '', component: LandingPageComponent },
];
