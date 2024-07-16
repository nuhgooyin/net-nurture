import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GoogleAuthService } from '../../services/google-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  error: string = '';
  isLoggedIn = false;
  isGoogleAuthenticated = false;

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
    this.googleAuthService.isGoogleAuthenticated().subscribe((status) => {
      this.isGoogleAuthenticated = status;
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
