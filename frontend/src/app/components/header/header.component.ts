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
  isLoggedIn = false;
  isGoogleAuthenticated = false;
  googleAuthenticationSubscription: Subscription | false = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;
    });
    this.googleAuthenticationSubscription = this.googleAuthService
      .isGoogleAuthenticated()
      .subscribe((status) => {
        this.isGoogleAuthenticated = status;
      });
  }

  ngOnDestroy(): void {
    if (this.googleAuthenticationSubscription) {
      this.googleAuthenticationSubscription.unsubscribe();
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
