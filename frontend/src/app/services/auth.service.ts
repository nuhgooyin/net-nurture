// src/app/services/auth.service.ts
import { catchError } from 'rxjs/operators';
import { throwError, Observable, of, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

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
        catchError((error) => {
          console.error('Logout error:', error);
          return throwError(error);
        }),
      );
  }

  verifyAuth(): Observable<boolean> {
    return this.http
      .get(`${this.baseUrl}/verify-auth`, { withCredentials: true })
      .pipe(
        catchError((error) => {
          console.error('Verify Auth error:', error);
          return of(false);
        }),
        map((response: any) => response.message === 'Authenticated'),
      );
  }
}
