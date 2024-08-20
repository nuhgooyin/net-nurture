import { Injectable } from '@angular/core';
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
}
