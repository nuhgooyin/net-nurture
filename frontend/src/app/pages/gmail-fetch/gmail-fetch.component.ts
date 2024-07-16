// src/app/components/gmail-fetch/gmail-fetch.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ContactService } from '../../services/contact.service';

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
    private contactService: ContactService,
  ) {}

  public fetchGmailMessages(): void {
    this.http
      .get('http://localhost:3000/api/gmail/fetch', { withCredentials: true })
      .subscribe(
        (res: any) => {
          console.log('Fetched Gmail messages:', res.messages);
          console.log('Fetched Gmail contacts:', res.contacts);
          this.snackBar.open('Emails fetched successfully', 'Close', {
            duration: 5000,
          });

          // Fetch contacts after fetching Gmail messages
          this.contactService.getContacts();
          this.router.navigate(['/dashboard']);
        },
        (error: any) => {
          this.snackBar.open('Error fetching emails: Unauthorized', 'Close', {
            duration: 5000,
          });
        },
      );
  }
}
