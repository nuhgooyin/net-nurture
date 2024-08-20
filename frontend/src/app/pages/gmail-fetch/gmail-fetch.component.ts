import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GmailFetchDialogComponent } from '../../components/gmail-fetch-dialog/gmail-fetch-dialog.component';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ContactService } from '../../services/contact.service';
import { GoogleAuthService } from '../../services/google-auth.service';

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
    public dialog: MatDialog,
    public googleAuthService: GoogleAuthService,
  ) {}

  public openFetchDialog(): void {
    const dialogRef = this.dialog.open(GmailFetchDialogComponent, {
      width: '400px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.googleAuthService
          .fetchGmailMessages(result)
          .pipe(
            switchMap(() => {
              // this.contactService.getContacts();
              return of(null);
            }),
            switchMap(() => {
              this.router.navigate(['/dashboard']);
              return of(null);
            }),
          )
          .subscribe(
            () => {
              this.googleAuthService.isLoading.next(false);
              this.snackBar.open(
                'Fetched Gmail messages and contacts successfully',
                'Close',
                {
                  duration: 3000,
                },
              );
            },
            (error) => {
              this.googleAuthService.isLoading.next(false);
              this.snackBar.open('Failed to fetch messages', 'Close', {
                duration: 3000,
              });
            },
          );
      }
    });
  }
}
