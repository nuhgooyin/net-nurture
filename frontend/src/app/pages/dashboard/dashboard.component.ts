import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../classes/contact';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ContactCardComponent } from '../../components/contact-card/contact-card.component';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { AuthService } from '../../services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'tags',
    'lastContacted',
    'summary',
    'actions',
  ];
  dataSource = new MatTableDataSource<Contact>();
  summarySliceLength: number = 100;
  dialogWidth: string = '1200px';
  userEmail: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private contactService: ContactService,
    public dialog: MatDialog,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Subscribe to the email status after confirming authentication
    this.authService
      .isLoggedIn()
      .pipe(take(1))
      .subscribe((loggedIn) => {
        if (loggedIn) {
          this.authService
            .getEmailStatus()
            .pipe(take(1))
            .subscribe((emailStatus) => {
              if (emailStatus) {
                this.userEmail = emailStatus;
                this.contactService.getContacts(emailStatus); // Fetch contacts
              }
            });
        }
      });

    this.contactService.contacts$.subscribe(
      (contacts: Contact[]) => {
        this.dataSource.data = contacts.map((contact: Contact) => ({
          id: contact.id,
          name: contact.name || 'Unknown', // Default value
          email: contact.email, // Ensure this field exists in the backend response
          tags: contact.tags || 'N/A', // Default value
          lastContacted: contact.lastContacted || 'N/A', // Default value
          summary: contact.summary || 'No preview available', // Default value
        }));
        this.dataSource.paginator = this.paginator;
      },
      (error: any) => {
        console.error('Error fetching contacts:', error);
      },
    );

    this.dataSource.filterPredicate = (data: Contact, filter: string) => {
      return data.name.toLowerCase().startsWith(filter);
    };
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddContactDialog(): void {
    const dialogRef = this.dialog.open(ContactFormComponent, {
      width: this.dialogWidth,
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.userEmail) {
        this.contactService
          .addContact(result, this.userEmail)
          .subscribe((newContact) => {
            this.dataSource.data = [...this.dataSource.data, newContact];
            this.dataSource.paginator = this.paginator; // Update paginator
          });
      }
    });
  }

  openEditContactDialog(contact: Contact): void {
    const dialogRef = this.dialog.open(ContactFormComponent, {
      width: this.dialogWidth,
      data: contact,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.userEmail) {
        this.contactService
          .updateContact(result, this.userEmail)
          .subscribe((updatedContact) => {
            const index = this.dataSource.data.findIndex(
              (c) => c.id === updatedContact.id,
            );
            if (index !== -1) {
              this.dataSource.data[index] = updatedContact;
              this.dataSource.data = [...this.dataSource.data]; // Trigger change detection
              this.dataSource.paginator = this.paginator; // Update paginator
            }
          });
      }
    });
  }

  addContact(contact: Contact): void {
    this.dataSource.data = [...this.dataSource.data, contact];
  }

  updateContact(contact: Contact): void {
    const index = this.dataSource.data.findIndex((c) => c.id === contact.id);
    if (index !== -1) {
      this.dataSource.data[index] = contact;
      this.dataSource.data = [...this.dataSource.data]; // Trigger change detection
    }
  }

  deleteContact(contact: Contact): void {
    if (this.userEmail) {
      this.contactService
        .deleteContact(contact.id, this.userEmail)
        .subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter(
            (c) => c.id !== contact.id,
          );
          this.dataSource.paginator = this.paginator; // Update paginator
        });
    }
  }

  showContactSummary(contact: Contact): void {
    const dialogRef = this.dialog.open(ContactCardComponent, {
      width: this.dialogWidth,
      data: contact,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
