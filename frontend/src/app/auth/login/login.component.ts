import { Component, OnInit } from '@angular/core';
import { AuthToggleService } from '../../services/auth-toggle.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
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
    this.authToggleService.isLoginVisible$.subscribe(
      (isVisible) => (this.isVisible = isVisible),
    );
  }

  onSubmit(): void {
    this.authService.signin(this.username, this.password).subscribe(
      (response) => {
        // Handle successful login
        this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
        this.router.navigate(['/']);
      },
      (error) => {
        // Handle error
        this.snackBar.open('Login failed: ' + error.error.error, 'Close', {
          duration: 3000,
        });
      },
    );
  }
}
