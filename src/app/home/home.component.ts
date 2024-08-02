import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeManagementService } from '../employeeManagement.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '../api-response';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  employees: any[] = [];
  newHires : any[] = [];
  empCount :number = 0;
  newHireCount : number = 0;
  department :any[] =[];
  departmentCount:number = 0;
  username:any='';
  
  constructor(private router: Router,
    private employeeManagementService: EmployeeManagementService,
    private cdr: ChangeDetectorRef,
  ){}

 
    
    ngOnInit(): void {
      debugger
     
      localStorage.removeItem('getNewHiresFlg');
     
      this.username = this.getUser();
      this.getEmployeeCount();
      this.getNewHires();
      this.getDepartments();
     

     

    }
      
  
   getEmployees():void{
    this.router.navigate(['employees']);
   }

   goToDepartments():void{
    this.router.navigate(['department']);
   }

   goToNewHires():void{
       localStorage.setItem('getNewHiresFlg','true')
       this.router.navigate(['employees']);
       this.cdr.detectChanges();
   }

   getEmployeeCount(): void {
    this.employeeManagementService.getEmployees("ID","","false",0,0).subscribe((response:ApiResponse) => {
      this.empCount = response.data.length;
      this.cdr.detectChanges();
    });
  }
    getNewHires():void {
         this.employeeManagementService.getNewHires().subscribe((response:ApiResponse)=>{ 
      this.newHireCount = response.data.length;
      this.cdr.detectChanges();
    });
  }
   getDepartments():void{
    debugger
    this.employeeManagementService.getDepartments('','').subscribe((response: ApiResponse) => {
      this.departmentCount = response.data.length;
      this.cdr.detectChanges();
    });
   }
  private getUser(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('username');
    }
    return null;
  }
}
