import { Component, OnInit } from '@angular/core';
import { EmployeeManagementService } from '../employeeManagement.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStateService } from '../auth-state.service';
import { response } from 'express';
import { error } from 'console';
import { ApiResponse } from '../api-response';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [FormsModule, CommonModule, MatSidenavModule, ReactiveFormsModule],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})
export class DepartmentComponent implements OnInit {
  departments: any[] = [];
  employees: any[] = [];
  ActiveStatus : any[]= ['Active','InActive']
  department: any = {
    departmentName: '',
    managerId: null,
    status: null,
    createdDate: null,
  };
  defaultOrderBy :string = '';
  defaultSearchText : string = '';
  mode: string = 'view'; // view, create, update
  searchForm: FormGroup;
  selectedEmployeeId: number = 0;
  defaultPageSize:number = 5;
  defaultPage:number = 1;

  constructor(
    private employeeManagementService: EmployeeManagementService,
    private route: ActivatedRoute, 
    private router: Router, 
    private sharedService: AuthStateService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchText: ['']
    });
  }
 
  ngOnInit(): void {
    this.searchForm.get('searchText')!.valueChanges.pipe(
      debounceTime(300), // Wait 300ms after the last keystroke before considering the value
      distinctUntilChanged(), // Only emit if value is different from previous value
      switchMap(searchText => this.employeeManagementService.getDepartments(this.defaultOrderBy, searchText,this.defaultPage,this.defaultPageSize)) // Switch to new observable with the latest search text
    ).subscribe((response:ApiResponse) => {
      debugger
      this.departments = response.data;
      
    });
    this.loadDepartments(this.defaultOrderBy,this.defaultSearchText,this.defaultPage,this.defaultPageSize)
    this.loadEmployees('Id', '', 'false',0,0);
  }

  // loadDepartments(): void {
  //   this.employeeManagementService.getDepartments().subscribe(
  //     data => this.departments = data,
  //     error => console.error('Error Loading Departments', error)
  //   );
  // }

  loadDepartments(orderBy:string,searchText:string,page:number,pageSize:number): void {
    if(pageSize === 0){
      pageSize = this.defaultPageSize
     }
    this.defaultOrderBy = orderBy;
    this.defaultSearchText = searchText;
    this.defaultPage = page;
    this.defaultPageSize = pageSize
    this.employeeManagementService.getDepartments(this.defaultOrderBy,this.defaultSearchText,this.defaultPage,this.defaultPageSize).subscribe(
      (response: ApiResponse) => {
        if (response.status) {
          this.departments = response.data;
          //alert(response.message);
        } else {
          console.error('Error: ' + response.message);
        }
      },
      error => console.error('Error Loading Departments', error)
    );
  }
   onPageSizeChange(event: Event): void {
      const selectElement = event.target as HTMLSelectElement;
      const pageSize = selectElement.value;
      this.loadDepartments(this.defaultOrderBy, this.defaultSearchText, this.defaultPage, +pageSize);
    }

  currentPage: number = 1;
    totalPages: number = 10; 
  
    onPageChange(action: number | string): void {
      if (typeof action === 'number') {
        this.currentPage = action;
      } else if (action === 'previous' && this.currentPage > 1) {
        this.currentPage--;
      } else if (action === 'next' && this.currentPage < this.totalPages) {
        this.currentPage++;
      }
      this.loadDepartments(this.defaultOrderBy, '', this.currentPage, this.defaultPageSize);
    }




  loadEmployees(orderBy: string, searchText: string, getNewHires: string,page:number,pageSize:number): void {
    this.employeeManagementService.getEmployees(orderBy, searchText, getNewHires,page,10).subscribe(
      (response:ApiResponse) => this.employees = response.data,
      error => console.error('Error loading employees:', error)
    );
  }

  setMode(mode: string, department?: any): void {
    this.mode = mode;
    if (department) {
      this.department = { ...department };
      if (this.department.createdDate) {
        this.department.createdDate = this.formatDate(this.department.formatedCreatedDate);
        
      }
    } else {
      this.department = {  };
    }
  }

  createDepartment(): void {
    debugger
    if(this.department.status === 'Active'){
      this.department.status = 'true';
    }else{ this.department.status = 'false';}
    console.log('Payload being sent:', this.department); // Debug line
    this.employeeManagementService.createDepartment(this.department).subscribe(() => {
      this.loadDepartments(this.defaultOrderBy,this.defaultSearchText,this.defaultPage,this.defaultPageSize);
      this.setMode('view');
    },
    error => console.error('Error creating department:', error)
    );
  }

  updateDepartment(): void {
    if(this.department.status === 'Active'){
      this.department.status = 'true';
    }
    else{this.department.status = 'false';}
    console.log('Payload being sent:', this.department); // Debug line
    this.employeeManagementService.updateDepartment(this.department.id,this.department).subscribe(()=>{
      this.loadDepartments(this.defaultOrderBy,this.defaultSearchText,this.defaultPage,this.defaultPageSize);
      this.setMode('view');
    },
   error => console.error('Error updating department:', error))
  }

  deleteDepartment(id: number): void {
    this.employeeManagementService.deleteDepartment(id).subscribe(()=>{
      this.loadDepartments(this.defaultOrderBy,this.defaultSearchText,this.defaultPage,this.defaultPageSize);
      
    
    })
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
