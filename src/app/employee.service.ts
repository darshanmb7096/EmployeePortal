import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://localhost:7198/api/Employee';
  
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+'/Employee', { headers: this.getHeaders() });
  }

   getEmployeesCount():number{
      return this.getEmployees.length;
   }
  

  createEmployee(employee: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'/Add', employee, { headers: this.getHeaders() });
  }

  updateEmployee(id: number, employee: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl+'/update'}/${id}`, employee, { headers: this.getHeaders() });
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl+'/delete'}/${id}`, { headers: this.getHeaders() });
  }
}
