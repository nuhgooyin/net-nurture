import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gmail-fetch',
  templateUrl: './gmail-fetch.component.html',
  styleUrls: ['./gmail-fetch.component.css'],
})
export class GmailFetchComponent {
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  public fetchGmailMessages() {
    this.http
      .get('http://localhost:3000/api/gmail/fetch', { withCredentials: true })
      .subscribe(
        (res: any) => {
          console.log('Fetched Gmail messages:', res.messages);
          console.log('Fetched Gmail contacts:', res.contacts);
          this.snackBar.open('Emails fetched successfully ', 'Close', {
            duration: 5000,
          });
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.snackBar.open('Error fetch emails: Unauthorized', 'Close', {
            duration: 5000,
          });
        },
      );
  }
}
