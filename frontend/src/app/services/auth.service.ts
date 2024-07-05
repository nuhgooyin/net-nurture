import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users'; // Your backend URL

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signin`, { username, password });
  }

  signup(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, { username, password });
  }
}
