import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from './api-response';

@Injectable({
  providedIn: 'root'
})
export class EmployeeManagementService {
  private EmpApiUrl = 'https://localhost:7198/api/Employee';
  private deptApiUrl = 'https://localhost:7198/api/Department';
  
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

  getEmployees(orderBy: string, searchText:string, getNewHires:string,page:number,pageSize:number): Observable<ApiResponse> {
    let params = new HttpParams().set('orderBy', orderBy).
    set('searchText', searchText).set('getNewHires', getNewHires).set('page', page).set('pageSize',pageSize);
    return this.http.get<ApiResponse>(`${this.EmpApiUrl}/Employee`, { headers: this.getHeaders(), params });
  }

  getDepartments(orderBy:string,searchText:string,page:number,pageSize:number):Observable<ApiResponse>{
    let params = new HttpParams().set('orderBy', orderBy).set('searchText', searchText).set('page', page).set('pageSize',pageSize);
    return this.http.get<ApiResponse>(`${this.deptApiUrl}/Departments`, { headers: this.getHeaders(),params });
  }


  getNewHires(): Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${this.EmpApiUrl}/NewHires`, { headers: this.getHeaders()});
  }

  getImages(): Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`http://localhost:62801/api/ExitApproval/ReadyForExit`);
  }
 
  // getEmployeesCount(): Observable<number> {
  //   return new Observable<number>(observer => {
  //     this.getEmployees("","","").subscribe(
  //       employees => {
  //         observer.next(employees.length);
  //         observer.complete();
  //       },
  //       error => {
  //         observer.error(error);
  //       }
  //     );
  //   });
  // }

  createEmployee(employee: any): Observable<any> {
    return this.http.post<any>(`${this.EmpApiUrl}/Add`, employee, { headers: this.getHeaders() });
  }

  createDepartment(department:any):Observable<any> {
    return this.http.post<any>(`${this.deptApiUrl}/Add`, department, { headers:this.getHeaders() });
  }

  updateEmployee(id: number, employee: any): Observable<any> {
    return this.http.put<any>(`${this.EmpApiUrl}/update/${id}`, employee, { headers: this.getHeaders() });
  }

  updateDepartment(id:number,department:any):Observable<any>{
    return this.http.put<any>(`${this.deptApiUrl}/update/${id}`,department,{headers:this.getHeaders()});
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete<any>(`${this.EmpApiUrl}/delete/${id}`, { headers: this.getHeaders() });
  }

  deleteDepartment(id:number): Observable<any>{
    return this.http.delete<any>(`${this.deptApiUrl}/delete/${id}`, { headers:this.getHeaders()});
  }

  private getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }
}
