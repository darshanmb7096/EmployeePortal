import { Component } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [FormsModule, CommonModule, MatSidenavModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  employees: any[] = [];
  employee: any = {};
  mode: string = 'view'; // view, create, update
  count: number = 0;

  constructor(private employeeService: EmployeeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      data => this.employees = data,
      error => console.error('Error loading employees:', error)
    );
  }

  setMode(mode: string, employee?: any): void {
    this.mode = mode;
    if (employee) {
      this.employee = { ...employee };
    } else {
      this.employee = {};
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  createEmployee(): void {
    this.employeeService.createEmployee(this.employee).subscribe(
      () => {
        this.loadEmployees();
        this.setMode('view');
      },
      error => console.error('Error creating employee:', error)
    );
  }

  updateEmployee(): void {
    this.employeeService.updateEmployee(this.employee.id, this.employee).subscribe(
      () => {
        this.loadEmployees();
        this.setMode('view');
      },
      error => console.error('Error updating employee:', error)
    );
  }

  deleteEmployee(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe(
      () => this.loadEmployees(),
      error => console.error('Error deleting employee:', error)
    );
  }
}
