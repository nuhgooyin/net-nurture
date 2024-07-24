import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GmailScheduleService {
  private baseUrl = 'https://api.net-nurture.com/api/gmail';

  constructor(private http: HttpClient) {}

  scheduleGmailMessage(
    sender: string,
    reciever: string,
    subject: string,
    content: string,
    schedule: number,
  ) {
    return this.http.post(
      `${this.baseUrl}/schedule`,
      {
        sender: sender,
        reciever: reciever,
        subject: subject,
        content: content,
        schedule: schedule,
      },
      { withCredentials: true },
    );
  }
}
