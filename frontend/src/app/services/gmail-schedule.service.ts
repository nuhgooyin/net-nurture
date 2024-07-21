import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GmailScheduleService {
  private baseUrl = 'http://localhost:3000/api/gmail';

  constructor(private http: HttpClient) {}

  scheduleGmailMessage(reciever: string, subject: string, content: string, schedule: number) {
    return this.http.post(
      `${this.baseUrl}/schedule`,
      {
        sender: 'j8977748@gmail.com',
        reciever: reciever,
        subject: subject,
        content: content,
        schedule: schedule,
      },
      { withCredentials: true },
    );
  }
}
