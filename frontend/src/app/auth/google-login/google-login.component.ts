import { Component } from '@angular/core';
import { GoogleAuthService } from '../../services/google-auth.service';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.scss'],
})
export class GoogleLoginComponent {
  constructor(private googleAuthService: GoogleAuthService) {}

  signInWithGoogle(): void {
    this.googleAuthService.signIn();
  }
}
