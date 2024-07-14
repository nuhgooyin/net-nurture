import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private clientId =
    '1058614153442-ud88lvna00od88q7qc3covgdr8s89bc6.apps.googleusercontent.com';

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleCredentialResponse.bind(this),
    });
  }

  signIn(): void {
    google.accounts.id.prompt();
  }

  handleCredentialResponse(response: any): void {
    console.log('Credential Response:', response);
    const token = response.credential;
    this.http
      .post('http://localhost:3000/api/google-auth/verify-token', { token })
      .subscribe(
        (res: any) => {
          // Successfully authenticated
          this.router.navigate(['/']);
        },
        (err: any) => {
          console.error('Error during sign-in', err);
          alert('An error occurred during sign-in. Please try again.');
        },
      );
  }

  public signOut(): void {
    this.http
      .post('http://localhost:3000/api/google-auth/signout', {})
      .subscribe(
        () => {
          this.router.navigate(['/']);
        },
        (err: any) => {
          console.error('Error during sign-out', err);
          alert('An error occurred during sign-out. Please try again.');
        },
      );
  }

  public fetchGmailMessages() {
    return this.http
      .get('http://localhost:3000/api/gmail/fetch')
      .subscribe((error) => {
        console.error('Error fetching Gmail messages:', error);
      });
  }
}
