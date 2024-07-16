// src/app/services/auth.service.ts
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://api.net-nurture.com/api/users';

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
}
