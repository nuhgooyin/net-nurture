// src/app/components/logout/logout.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
})
export class LogoutComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {}

  public logout(): void {
    this.authService.logout().subscribe(
      (response) => {
        this.snackBar.open('Logout successful!', 'Close', { duration: 3000 });
        this.router.navigate(['/']);
      },
      (error) => {
        this.snackBar.open('Logout failed: ' + error.error.error, 'Close', {
          duration: 3000,
        });
      },
    );
  }
}
