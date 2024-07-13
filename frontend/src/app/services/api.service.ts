import { Injectable } from '@angular/core';
import { Message } from '../classes/message';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
//import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  endpoint = 'https://api.net-nurture.com';
  //endpoint = environment.apiEndpoint;

  constructor(private http: HttpClient) {}

  getMessages(): Observable<{ messages: Message[] }> {
    return this.http.get<{ messages: Message[] }>(
      this.endpoint + `/api/messages`,
    );
  }
}
