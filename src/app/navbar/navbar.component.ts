import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AuthStateService } from '../auth-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLogin: boolean = false;

  constructor(private router: Router, private authService: AuthService, private authStateService: AuthStateService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.authStateService.isLogin.subscribe((isLogin) => {
      this.isLogin = isLogin;
      this.cdr.detectChanges();
    });

    this.isLogin = this.authService.isAuthenticated();
    this.cdr.detectChanges();
  }

  login(): void {
    this.router.navigate(['']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }

  getEmployees(): void {
    if (this.isLogin) {
      this.router.navigate(['employees']);
    } else {
      alert("Please login")
      this.router.navigate(['login']);
    }
  }

  goToHome(): void {
    if (this.isLogin) {
      this.router.navigate(['home']);
    } else {
      alert("Please login")
      this.router.navigate(['login']);
    }
  }
}
