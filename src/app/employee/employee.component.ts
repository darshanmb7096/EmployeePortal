import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthStateService } from '../auth-state.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [FormsModule, CommonModule, MatSidenavModule, ReactiveFormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employees: any[] = [];
  employee: any = {};
  mode: string = 'view'; // view, create, update
  count: number = 0;
  username:any='';
  DefaultorderBy:string="";
  defaultSearchTeaxt:string = '';
  searchForm: FormGroup;
  formatedJoiningDate:string='';

  constructor(private employeeService: EmployeeService, 
    private route: ActivatedRoute, private router: Router, 
    private sharedService:AuthStateService,private fb: FormBuilder) { 
      debugger
      this.searchForm = this.fb.group({
        searchText: ['']
      });
    }

  ngOnInit(): void {
    debugger
    this.searchForm.get('searchText')!.valueChanges.pipe(
     
      debounceTime(300), // Wait 300ms after the last keystroke before considering the value
      distinctUntilChanged(), // Only emit if value is different from previous value
      switchMap(searchText => this.employeeService.getEmployees(this.DefaultorderBy, searchText)) // Switch to new observable with the latest search text
    ).subscribe(employees => {
      debugger
      this.employees = employees;
      
    });
   
    if(this.getToken==null){
      alert("Please Login")
      this.router.navigate(['']);
      
    }else{
      this.loadEmployees(this.DefaultorderBy,this.defaultSearchTeaxt);
    }
    }
    private getToken(): string | null {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('token');
      }
      return null;
    }

  loadEmployees(orderBy:string,searchText:string): void {
    this.DefaultorderBy = orderBy;
    this.defaultSearchTeaxt = searchText;
    
    this.employeeService.getEmployees(orderBy,searchText).subscribe(
      data => this.employees = data,
      error => console.error('Error loading employees:', error)
    );
  }

  setMode(mode: string, employee?: any): void {
    this.mode = mode;

    if (employee) {
      this.employee = { ...employee };
      if (this.employee.joiningDate) {
        this.employee.joiningDate = this.formatDate(this.employee.formatedJD);
        console.log(this.employee.joiningDate);
      }
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
        this.loadEmployees(this.DefaultorderBy,this.defaultSearchTeaxt);
        this.setMode('view');
      },
      error => console.error('Error creating employee:', error)
    );
  }

  updateEmployee(): void {
    this.employeeService.updateEmployee(this.employee.id, this.employee).subscribe(
      () => {
        this.loadEmployees(this.DefaultorderBy,this.defaultSearchTeaxt);
        this.setMode('view');
      },
      error => console.error('Error updating employee:', error)
    );
  }

  deleteEmployee(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe(
      () => this.loadEmployees(this.DefaultorderBy,this.defaultSearchTeaxt),
      error => console.error('Error deleting employee:', error)
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
 
}
