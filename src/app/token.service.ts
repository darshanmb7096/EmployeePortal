import { Injectable } from '@angular/core';
import jwt_decode, { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  getToken(): any | null {
    typeof localStorage !== 'undefined' && !!localStorage.getItem('token')
  }

  decodeToken(token: string): any {
    return jwtDecode(token);
  }

  getTokenExpirationDate(token: string): Date | null {
    const decodedToken = this.decodeToken(token);
    if (decodedToken.exp === undefined) return null;

    const date = new Date(0); 
    date.setUTCSeconds(decodedToken.exp);
    return date;
  }

  isTokenExpired(token?: any): boolean {
    if (!token) token = this.getToken();
    if (!token) return true;
  
    const expirationDate = this.getTokenExpirationDate(token);
    if (!expirationDate) return true; // Handle null or undefined expirationDate
  
    return !(expirationDate.valueOf() > new Date().valueOf());
  }
  
}
