import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { ContactService } from './contact.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://api.net-nurture.com/api/users';
  private loggedIn = new BehaviorSubject<boolean>(false);
  private emailStatus = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    private contactService: ContactService,
  ) {
    this.checkLoginStatus().subscribe();
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
          return response;
        }),
        switchMap(() => this.fetchEmailStatus()), // Ensure email status is fetched after sign in
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

  fetchEmailStatus(): Observable<void> {
    return this.http
      .get<{ email: string }>(`${this.baseUrl}/email`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          this.emailStatus.next(response.email);
          return;
        }),
        catchError((error) => {
          console.error('Error fetching email status:', error);
          return throwError(error);
        }),
      );
  }

  checkLoginStatus(): Observable<boolean> {
    return this.http
      .get<{
        message: string;
      }>(`${this.baseUrl}/verify-auth`, { withCredentials: true })
      .pipe(
        map((response) => response.message === 'Authenticated'),
        tap((isAuthenticated) => {
          this.loggedIn.next(isAuthenticated);
        }),
        switchMap((isAuthenticated) => {
          if (isAuthenticated) {
            return this.fetchEmailStatus().pipe(map(() => true));
          }
          return of(false);
        }),
        catchError((error) => {
          console.error('Check login status error:', error);
          this.loggedIn.next(false);
          return of(false);
        }),
      );
  }
}
