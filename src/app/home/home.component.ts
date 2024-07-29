import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  username:any='';
  constructor(private router: Router,
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef,
  ){}

 
    
    ngOnInit(): void {
      debugger
     
      localStorage.removeItem('getNewHiresFlg');
     
      this.username = this.getUser();
      this.getEmployeeCount();
      this.getNewHires();
     

     

    }
      
  
   getEmployees():void{
    this.router.navigate(['employees']);
   }

   goToNewHires():void{
       localStorage.setItem('getNewHiresFlg','true')
       this.router.navigate(['employees']);
       this.cdr.detectChanges();
   }

   getEmployeeCount(): void {
    this.employeeService.getEmployees("ID","","false").subscribe(employees => {
      this.empCount = employees.length;
      this.cdr.detectChanges();
    });
  }
    getNewHires():void {
         this.employeeService.getNewHires().subscribe(newHires=>{ 
      this.newHireCount = newHires.length;
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
