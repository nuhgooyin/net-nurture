import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private clientId =
    '1058614153442-ud88lvna00od88q7qc3covgdr8s89bc6.apps.googleusercontent.com';
  private redirectUri = 'http://localhost:4200'; // This should be the URL where your application is running

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        clientId: this.clientId,
        scope: 'https://www.googleapis.com/auth/gmail.readonly',
        plugin_name: 'net-nurture',
      });
    });
  }

  public signIn() {
    this.ensureGapiLoaded().then(() => {
      const auth2 = gapi.auth2.getAuthInstance();
      auth2.signIn().then(
        (googleUser: any) => {
          const token = googleUser.getAuthResponse().id_token;
          localStorage.setItem('googleToken', token);
          this.router.navigate(['/']); // Redirect to the home page or any other page after successful login
        },
        (error: any) => {
          if (error.error === 'popup_closed_by_user') {
            console.warn('Popup closed by user');
            alert('Sign-in process was interrupted. Please try again.');
          } else {
            console.error('Error during sign-in', error);
            alert('An error occurred during sign-in. Please try again.');
          }
        },
      );
    });
  }

  public signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      localStorage.removeItem('googleToken');
      this.router.navigate(['/']);
    });
  }

  private ensureGapiLoaded(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof gapi !== 'undefined') {
        resolve();
      } else {
        const checkGapi = setInterval(() => {
          if (typeof gapi !== 'undefined') {
            clearInterval(checkGapi);
            resolve();
          }
        }, 100);
      }
    });
  }

  public getToken() {
    return localStorage.getItem('googleToken');
  }

  public fetchGmailMessages() {
    const token = this.getToken();
    if (token) {
      const headers = { Authorization: `Bearer ${token}` };
      return this.http.get('http://localhost:3000/api/gmail/fetch', {
        headers,
      });
    } else {
      throw new Error('User is not authenticated');
    }
  }
}
