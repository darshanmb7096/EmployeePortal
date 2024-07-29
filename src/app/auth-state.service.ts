import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());
  
  constructor() {}

   hasToken(): boolean {
    return typeof localStorage !== 'undefined' && !!localStorage.getItem('token');
  }

  get isLogin() {
    return this.isLoginSubject.asObservable();
  }

  login() {
    this.isLoginSubject.next(true);
  }

  logout() {
    this.isLoginSubject.next(false);
  }
  
}
