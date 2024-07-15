import { Component } from '@angular/core';
import { GoogleAuthService } from '../../services/google-auth.service';

@Component({
  selector: 'app-gmail-send',
  templateUrl: './gmail-send.component.html',
  styleUrl: './gmail-send.component.css'
})
export class GmailSendComponent {
  constructor(private googleAuthService: GoogleAuthService) {}

  sendGmail(): void {
    this.googleAuthService.sendGmailMessage("j8977748@gmail.com", "j8977748@gmail.com", "Test Subject", "Test Email Content");
  }
}
