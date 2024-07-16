// src/app/services/contact.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from '../classes/contact';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'https://api.net-nurture.com/api/contacts';
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  contacts$ = this.contactsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getContacts(): void {
    this.http.get<Contact[]>(this.apiUrl).subscribe(
      (contacts) => {
        this.contactsSubject.next(contacts);
      },
      (error) => {
        console.error('Error fetching contacts:', error);
      },
    );
  }
}
