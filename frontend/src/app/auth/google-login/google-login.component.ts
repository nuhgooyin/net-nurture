import { Component, OnInit, OnDestroy } from '@angular/core';
import { GoogleAuthService } from '../../services/google-auth.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.scss'],
})
export class GoogleLoginComponent {
  email: string | null = '';
  private emailStatusSubscription: Subscription | null = null;

  constructor(
    private googleAuthService: GoogleAuthService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.emailStatusSubscription = this.authService.getEmailStatus().subscribe(
      (email: string | null) => {
        this.email = email;
      },
      (error: any) => {
        console.error('Error fetching email status', error);
      },
    );
  }

  ngOnDestroy(): void {
    if (this.emailStatusSubscription) {
      this.emailStatusSubscription.unsubscribe();
    }
  }

  signInWithGoogle(): void {
    this.googleAuthService.signIn();
  }
}
