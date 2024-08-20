import { Component, OnInit } from '@angular/core';
import { EmployeeManagementService } from '../employeeManagement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthStateService } from '../auth-state.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ApiResponse } from '../api-response';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [FormsModule, CommonModule, MatSidenavModule, ReactiveFormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employees: any[] = [];
  departments : any[] = [];
  department :any = {};
  employee: any = {};
  mode: string = 'view'; // view, create, update
  count: number = 0;
  username:any='';
  DefaultorderBy:string="";
  defaultSearchTeaxt:string = '';
  searchForm: FormGroup;
  formatedJoiningDate:string='';
  defaultNewHireFlg:any='';
  defaultPageSize:number = 5;
  defaultPage:number = 1;
  heading:any='';
  
  

  constructor(private employeeManagementService : EmployeeManagementService , 
    private route: ActivatedRoute, private router: Router, 
    private sharedService:AuthStateService,private fb: FormBuilder) { 
      debugger
      this.searchForm = this.fb.group({
        searchText: ['']
      });
    }

  ngOnInit(): void {
    debugger
    this.loadDepartments('','',0,100);
    this.defaultNewHireFlg = typeof localStorage !== 'undefined' && !!localStorage.getItem('getNewHiresFlg');
    this.searchForm.get('searchText')!.valueChanges.pipe(
      debounceTime(300), // Wait 300ms after the last keystroke before considering the value
      distinctUntilChanged(), // Only emit if value is different from previous value
      switchMap(searchText => this.employeeManagementService.getEmployees(this.DefaultorderBy, searchText,this.defaultNewHireFlg,this.defaultPage,this.defaultPageSize)) // Switch to new observable with the latest search text
    ).subscribe((response:ApiResponse) => {
      debugger
      this.employees = response.data;
      
    });
   
    if(this.getToken==null){
      alert("Please Login")
      this.router.navigate(['login']);
      
    }else{
      this.loadEmployees(this.DefaultorderBy,this.defaultSearchTeaxt,this.defaultNewHireFlg,this.defaultPage,this.defaultPageSize);
      console.log(this.defaultNewHireFlg);
    }
    }

    
  loadDepartments(orderBy: string, searchText: string, page:number,pageSize:number): void {
    this.employeeManagementService.getDepartments(orderBy, searchText,page,100).subscribe(
      (response:ApiResponse) => this.departments = response.data,
      error => console.error('Error loading employees:', error)
    );
  }


    private getToken(): string | null {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('token');
      }
      return null;
    }
    private getNewHiresFlg(): string | null {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('getNewHires');
      }
      return null;
    }

    onPageSizeChange(event: Event): void {
      const selectElement = event.target as HTMLSelectElement;
      const pageSize = selectElement.value;
      this.loadEmployees(this.DefaultorderBy, this.defaultSearchTeaxt, this.defaultNewHireFlg, this.defaultPage, +pageSize);
    }


    currentPage: number = 1;
    totalPages: number = 100; 
  
    onPageChange(action: number | string): void {
      if (typeof action === 'number') {
        this.currentPage = action;
      } else if (action === 'previous' && this.currentPage > 1) {
        this.currentPage--;
      } else if (action === 'next' && this.currentPage < this.totalPages) {
        this.currentPage++;
      }
      this.loadEmployees(this.DefaultorderBy, '', '', this.currentPage, this.defaultPageSize);
    }
    

  loadEmployees(orderBy:string,searchText:string,getNewHires:string,page:number,pageSize:number): void {
    debugger
    if (localStorage.getItem('getNewHiresFlg') === 'true') {
      this.heading = 'New Hires';
       } else  {
      this.heading = 'Employee List';
       }
       if(pageSize === 0){
        pageSize = this.defaultPageSize
       }
    this.DefaultorderBy = orderBy;
    this.defaultSearchTeaxt = searchText;
    this.defaultPage = page;
    this.defaultPageSize = pageSize
    getNewHires = this.defaultNewHireFlg;
    this.employeeManagementService.getEmployees(this.DefaultorderBy,this.defaultSearchTeaxt,this.defaultNewHireFlg,this.defaultPage,this.defaultPageSize).subscribe(
      (response:ApiResponse)=> this.employees = response.data,
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
    this.router.navigate(['/login']);
  }

  createEmployee(): void {
    this.employeeManagementService.createEmployee(this.employee).subscribe(
      () => {
        this.loadEmployees(this.DefaultorderBy,this.defaultSearchTeaxt,this.defaultNewHireFlg,this.defaultPage,this.defaultPageSize);
        this.setMode('view');
      },
      error => console.error('Error creating employee:', error)
    );
  }

  updateEmployee(): void {
    debugger
    this.employeeManagementService.updateEmployee(this.employee.id, this.employee).subscribe(
      () => {
        this.loadEmployees(this.DefaultorderBy,this.defaultSearchTeaxt,this.defaultNewHireFlg,this.defaultPage,this.defaultPageSize);
        this.setMode('view');
      },
      error => console.error('Error updating employee:', error)
    );
  }

  deleteEmployee(id: number): void {
    this.employeeManagementService.deleteEmployee(id).subscribe(
      () => this.loadEmployees(this.DefaultorderBy,this.defaultSearchTeaxt,this.defaultNewHireFlg,this.defaultPage,this.defaultPageSize),
      error => console.error('Error deleting employee:', error)
    );
  }

  getNewHires():void{
    this.employeeManagementService.getNewHires().subscribe(
      (response:ApiResponse)=>this.employees = response.data,
      error => console.error('Error getting Count:', error)
    )
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
 
}
