// src/app/pages/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../classes/contact';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  contacts: Contact[] = [];

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactService.contacts$.subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts.map((contact: Contact) => ({
          id: contact.id,
          name: contact.name || 'Unknown', // Default value
          email: contact.email, // Ensure this field exists in the backend response
          tags: contact.tags || 'N/A', // Default value
          dateOfLastConvo: contact.dateOfLastConvo || 'N/A', // Default value
          previewContent: contact.previewContent || 'No preview available', // Default value
        }));
      },
      (error: any) => {
        console.error('Error fetching contacts:', error);
      },
    );
  }
}
