import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EmployeeManagementService } from '../employeeManagement.service';
import { ApiResponse } from '../api-response';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
ngOnInit(): void {
  this.getImages();
}
constructor( private router: Router,public employeeManagementService: EmployeeManagementService ) {
 
}
requests: any[] = [];

  imageUrl: string = '/assets/lp.png';

  getImages():void {
    debugger
    this.employeeManagementService.getImages().subscribe((response:ApiResponse) => {
      this.requests = response.data;
    });
}

 
}
