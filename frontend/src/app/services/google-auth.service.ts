import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private clientId =
    '1058614153442-ud88lvna00od88q7qc3covgdr8s89bc6.apps.googleusercontent.com';
  private googleAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private http: HttpClient,
    private ngZone: NgZone,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleCredentialResponse.bind(this),
    });
  }

  signIn(): void {
    google.accounts.oauth2
      .initCodeClient({
        client_id: this.clientId,
        scope: 'https://www.googleapis.com/auth/gmail.modify',
        ux_mode: 'popup',
        callback: (response: any) => this.handleOAuthResponse(response),
      })
      .requestCode();
  }

  handleCredentialResponse(response: any): void {
    console.log('Credential Response:', response);
  }

  handleOAuthResponse(response: any): void {
    const code = response.code;

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XmlHttpRequest',
    });

    this.http
      .post(
        'https://api.net-nurture.com/api/google-auth/verify-code',
        `code=${code}`,
        { headers, withCredentials: true },
      )
      .subscribe(
        (res: any) => {
          this.ngZone.run(() => {
            this.router.navigate(['/dashboard']);
            this.snackBar.open('Linked your Gmail successfully!', 'Close', {
              duration: 3000,
            });
            this.fetchGmailMessages();
            this.authService.fetchEmailStatus();
          });
        },
        (err: any) => {
          console.error('Error during sign-in', err);
          this.snackBar.open(
            'An error occurred during sign-in. Please try again.',
            'Close',
            { duration: 3000 },
          );
        },
      );
  }

  fetchGmailMessages(): void {
    this.http
      .get('https://api.net-nurture.com/api/gmail/fetch', {
        withCredentials: true,
      })
      .subscribe(
        (res: any) => {
          console.log('Fetched Gmail threads:', res.threadsProcessed);
          console.log('Fetched Gmail contacts:', res.createdContacts);
        },
        (error) => {
          console.error('Error fetching Gmail messages:', error);
        },
      );
  }
}
