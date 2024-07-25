import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { EmployeeComponent } from './employee/employee.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
  { path: '', component: LoginComponent },
  { path: 'employees', component: EmployeeComponent, canActivate: [AuthGuard] },
];
