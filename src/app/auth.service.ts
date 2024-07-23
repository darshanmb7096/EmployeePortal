import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7198/api/Login';
 
  constructor(private http: HttpClient, private router: Router,
    private authStateService: AuthStateService ) { }

  login(user: any): Observable<any> {
    const headers = new HttpHeaders().set('EmpApiKey', 'Emp101@Imf');
    return this.http.put<any>(`${this.apiUrl}/Login`, user, {headers}).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.authStateService.login();
         
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authStateService.logout();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    if(this.getToken() !== null){
      return true;
    }else return false;
  }
}
