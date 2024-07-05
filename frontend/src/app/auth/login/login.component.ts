import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username: string = ''; // Initialize property
  password: string = ''; // Initialize property

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        console.log('Login successful:', response);
        // Handle successful login (e.g., navigate to dashboard)
      },
      (error) => {
        console.error('Login error:', error);
        // Handle login error
      },
    );
  }
}
