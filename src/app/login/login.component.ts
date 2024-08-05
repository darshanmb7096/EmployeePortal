import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
  user: any = {};

  constructor(private authService: AuthService, private authStateService: AuthStateService, private router: Router) {}
   ngOnInit(): void {
     if(localStorage.getItem('token')!=null){
      alert("Already Logged in")
      this.router.navigate(['/home']);
     }
   }

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
