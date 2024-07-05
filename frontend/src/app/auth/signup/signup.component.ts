import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthToggleService } from '../../services/auth-toggle.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  username: string = '';
  password: string = '';
  isVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private authToggleService: AuthToggleService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.authToggleService.isSignupVisible$.subscribe(
      (isVisible) => (this.isVisible = isVisible),
    );
  }

  onSubmit(): void {
    this.authService.signup(this.username, this.password).subscribe(
      (response) => {
        // Handle successful signup
        this.snackBar.open('Signup successful!', 'Close', { duration: 3000 });
        this.router.navigate(['/']);
      },
      (error) => {
        // Handle error
        this.snackBar.open('Signup failed: ' + error.error.error, 'Close', {
          duration: 3000,
        });
      },
    );
  }
}
