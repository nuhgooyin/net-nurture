import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from '../classes/contact';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'https://api.net-nurture.com/api/contacts';
  private llmUrl = 'https://api.net-nurture.com/api/llm/summarize';
  private watchUrl = 'https://api.net-nurture.com/api/gmail/watch';
  private updateUrl = 'https://api.net-nurture.com/api/gmail/update';
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  contacts$ = this.contactsSubject.asObservable();

  constructor(private http: HttpClient) { }

  getContacts(email: string): void {
    let params = new HttpParams().set('email', email);

    // Ensure summarizeContacts() completes before calling getContacts()
    this.summarizeContacts()
      .pipe(
        switchMap(() => {
          return this.http.get<Contact[]>(this.apiUrl, { params });
        }),
      )
      .subscribe(
        (contacts) => {
          this.contactsSubject.next(contacts);
        },
        (error) => {
          console.error('Error fetching contacts:', error);
        },
      );
  }

  summarizeContacts(): Observable<any> {
    return this.http.post(this.llmUrl, {});
  }

  addContact(contact: Contact, userEmail: string): Observable<Contact> {
    const requestBody = { ...contact, userEmail }; // Send both userEmail and contact data
    return this.http.post<Contact>(this.apiUrl, requestBody);
  }

  updateContact(contact: Contact, userEmail: string): Observable<Contact> {
    const requestBody = { ...contact, userEmail }; // Send both userEmail and contact data
    return this.http.put<Contact>(`${this.apiUrl}/${contact.id}`, requestBody);
  }

  deleteContact(id: number, userEmail: string): Observable<void> {
    let params = new HttpParams().set('email', userEmail);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { params });
  }

  clearContacts(): void {
    this.contactsSubject.next([]);
  }

  // Method to set up Gmail webhook watch
  watchGmail(email: string): Observable<any> {
    return this.http.post(this.watchUrl, { email });
  }

  // Method to handle Gmail webhook updates
  handleGmailUpdate(data: any): Observable<any> {
    return this.http.post(this.updateUrl, data);
  }
}
