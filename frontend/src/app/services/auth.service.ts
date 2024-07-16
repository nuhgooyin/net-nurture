import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError, Observable, of, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://api.net-nurture.com/api/users';
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
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

  private checkLoginStatus() {
    this.http
      .get(`${this.baseUrl}/verify-auth`, { withCredentials: true })
      .subscribe(
        (response: any) => {
          this.loggedIn.next(response.message === 'Authenticated');
        },
        () => {
          this.loggedIn.next(false);
        },
      );
  }
}
