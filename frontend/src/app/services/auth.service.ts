import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://api.net-nurture.com/api/users';

  constructor(private http: HttpClient) {}

  signup(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, { username, password });
  }

  signin(username: string, password: string): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/signin`, { username, password })
      .pipe(
        map((response: any) => {
          // Save token in local storage or cookie
          localStorage.setItem('token', response.token);
          return response;
        }),
      );
  }

  signout(): void {
    // Clear token from local storage or cookie
    localStorage.removeItem('token');
  }
}
