import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GoogleAuthService } from '../../services/google-auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  error: string = '';
  email: string | null = '';
  isLoggedIn = false;
  isGoogleAuthenticated = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private api: ApiService,
    private router: Router,
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.isLoggedIn().subscribe((status) => {
        this.isLoggedIn = status;
      }),
      this.authService.getEmailStatus().subscribe(
        (email: string | null) => {
          this.email = email;
          if (this.email === null) {
            this.isGoogleAuthenticated = false;
          } else {
            this.isGoogleAuthenticated = true;
          }
        },
        (error: any) => {
          console.error('Error fetching email status', error);
        },
      ),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
