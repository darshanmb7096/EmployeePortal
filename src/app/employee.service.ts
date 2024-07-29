import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
      'Authorization': `Bearer ${this.getToken()}`
    });
  }

  getEmployees(orderBy: string, searchText:string, getNewHires:string): Observable<any[]> {
    
    let params = new HttpParams().set('orderBy', orderBy).set('searchText', searchText).set('getNewHires', getNewHires);

    return this.http.get<any[]>(`${this.apiUrl}/Employee`, { headers: this.getHeaders(), params });
  }

  getNewHires(): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/NewHires`, { headers: this.getHeaders()});
  }
 
  getEmployeesCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.getEmployees("","","").subscribe(
        employees => {
          observer.next(employees.length);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  createEmployee(employee: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Add`, employee, { headers: this.getHeaders() });
  }

  updateEmployee(id: number, employee: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, employee, { headers: this.getHeaders() });
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() });
  }

  private getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }
}
