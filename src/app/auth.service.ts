import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7198/api/Login';

  constructor(private http: HttpClient, private router: Router, private authStateService: AuthStateService) { }

  login(user: any): Observable<any> {
    const headers = new HttpHeaders().set('EmpApiKey', 'Emp101@Imf');
    return this.http.put<any>(`${this.apiUrl}/Login`, user, { headers }).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          this.authStateService.login();
        }
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.authStateService.logout();
    this.router.navigate(['/login']);
  }

  private setToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  private removeToken(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
