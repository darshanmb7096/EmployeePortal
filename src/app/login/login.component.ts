import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStateService } from '../auth-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: any = {};

  constructor(private authService: AuthService, private authStateService: AuthStateService, private router: Router) {}

  login(): void {
    this.authService.login(this.user).subscribe(
      () => {
        debugger
        localStorage.setItem('username',this.user.Username);
        alert('Login Successful');
      
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials.');
      }
    );
  }
}
