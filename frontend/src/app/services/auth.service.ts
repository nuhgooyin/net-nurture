// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContactService } from './contact.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/users';
  private loggedIn = new BehaviorSubject<boolean>(false);
  private emailStatus = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    private contactService: ContactService,
  ) {
    this.checkLoginStatus();
  }

  signup(username: string, password: string): Observable<any> {
    return this.http
      .post(
        `${this.baseUrl}/signup`,
        { username, password },
        { withCredentials: true },
      )
      .pipe(
        catchError((error) => {
          console.error('Signup error:', error);
          return throwError(error);
        }),
      );
  }

  signin(username: string, password: string): Observable<any> {
    return this.http
      .post(
        `${this.baseUrl}/signin`,
        { username, password },
        { withCredentials: true },
      )
      .pipe(
        map((response) => {
          this.loggedIn.next(true);
          this.fetchEmailStatus(); // Update email status on sign in
          return response;
        }),
        catchError((error) => {
          console.error('Signin error:', error);
          return throwError(error);
        }),
      );
  }

  logout(): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/signout`, {}, { withCredentials: true })
      .pipe(
        map((response) => {
          this.loggedIn.next(false);
          this.emailStatus.next(null); // Clear email status on logout
          this.contactService.clearContacts(); // Clear contacts on logout
          return response;
        }),
        catchError((error) => {
          console.error('Logout error:', error);
          return throwError(error);
        }),
      );
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getEmailStatus(): Observable<string | null> {
    return this.emailStatus.asObservable();
  }

  public fetchEmailStatus() {
    this.http
      .get<{ email: string }>(`${this.baseUrl}/email`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response.email),
        catchError((error) => {
          console.error('Error fetching email status:', error);
          return throwError(error);
        }),
      )
      .subscribe((email) => {
        this.emailStatus.next(email);
      });
  }

  private checkLoginStatus() {
    this.http
      .get(`${this.baseUrl}/verify-auth`, { withCredentials: true })
      .subscribe(
        (response: any) => {
          this.loggedIn.next(response.message === 'Authenticated');
          // if (response.message === 'Authenticated') {
          //   this.fetchEmailStatus(); // Fetch email status if authenticated
          // }
        },
        () => {
          this.loggedIn.next(false);
        },
      );
  }
}
