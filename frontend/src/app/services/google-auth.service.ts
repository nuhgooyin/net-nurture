import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ContactService } from './contact.service';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private clientId =
    '1058614153442-ud88lvna00od88q7qc3covgdr8s89bc6.apps.googleusercontent.com';
  private googleAuthenticated = new BehaviorSubject<boolean>(false);
  public isLoading = new BehaviorSubject<boolean>(false);
  show$ = this.isLoading.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private ngZone: NgZone,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private contactService: ContactService, // Inject ContactService
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
        scope:
          'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
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
            this.authService.fetchEmailStatus().subscribe((emailStatus) => {
              if (emailStatus != null) {
                this.contactService.watchGmail(emailStatus).subscribe(() => {
                  this.router.navigate(['/dashboard']);
                  this.snackBar.open(
                    'Linked your Gmail successfully!',
                    'Close',
                    {
                      duration: 3000,
                    },
                  );
                });
              }
            });
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

  fetchGmailMessages(options?: any): Observable<any> {
    this.isLoading.next(true);
    let url = 'https://api.net-nurture.com/api/gmail/fetch';
    if (options) {
      const { emailCount, emailFolder, maxPerContact } = options;
      url = `${url}?maxResults=${emailCount}&q=${emailFolder}&maxSame=${maxPerContact}`;
    }

    return this.http.get(url, { withCredentials: true });
  }
}
