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
    this.contactService.getContacts();
    this.router.navigate(['/dashboard']);
  }
}
