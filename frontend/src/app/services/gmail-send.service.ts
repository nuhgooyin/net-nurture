import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GmailSendService {
  private baseUrl = 'https://api.net-nurture.com/api/gmail';

  constructor(private http: HttpClient) {}

  sendGmailMessage(reciever: string, subject: string, content: string) {
    return this.http.post(
      `${this.baseUrl}/send`,
      {
        sender: 'j8977748@gmail.com',
        reciever: reciever,
        subject: subject,
        content: content,
      },
      { withCredentials: true },
    );
  }
}
