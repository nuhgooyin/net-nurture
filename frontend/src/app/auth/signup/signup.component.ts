import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  username: string = ''; // Initialize property
  password: string = ''; // Initialize property

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.authService.signup(this.username, this.password).subscribe(
      (response) => {
        console.log('Sign up successful:', response);
        // Handle successful sign-up (e.g., navigate to login)
      },
      (error) => {
        console.error('Sign up error:', error);
        // Handle sign-up error
      },
    );
  }
}
