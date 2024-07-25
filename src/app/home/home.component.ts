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
  empCount :number = 0;
  username:any='';
  constructor(private router: Router,private employeeService: EmployeeService,private cdr: ChangeDetectorRef){}

 
    
    ngOnInit(): void {
      this.username = this.getUser();
      this.getEmployeeCount();
    }
      
  
   getEmployees():void{
    this.router.navigate(['employees']);
   }

   getEmployeeCount(): void {
    this.employeeService.getEmployees("ID","").subscribe(employees => {
      this.empCount = employees.length;
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
