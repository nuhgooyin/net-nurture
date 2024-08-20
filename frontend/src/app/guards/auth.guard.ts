import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  canActivate(): Observable<boolean> {
    return this.authService.checkLoginStatus().pipe(
      switchMap(() => this.authService.isLoggedIn()),
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.snackBar.open('Login first!', 'Close', { duration: 3000 });
          this.router.navigate(['/login']);
        }
      }),
    );
  }
}
