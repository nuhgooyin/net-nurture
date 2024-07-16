import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GoogleAuthService } from '../../services/google-auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gmail-send',
  templateUrl: './gmail-send.component.html',
  styleUrl: './gmail-send.component.css'
})
export class GmailSendComponent implements OnInit {
  @Output() newMessage = new EventEmitter<string>();
  error: string = '';
  gmailsendForm: FormGroup;

  constructor(private googleAuthService: GoogleAuthService, private fb: FormBuilder, private router: Router) {
    this.gmailsendForm = this.fb.group({
      reciever: ['', Validators.required],
      subject: ['', Validators.required],
      content: ['', Validators.required],
      schedule: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  sendGmail(reciever: string, subject: string, content: string, schedule: any): void {
    var scheduledDate = new Date(schedule);
    console.log("Sending email at" + scheduledDate);
    const timeLeft =  scheduledDate.getTime() - Date.now();
    const timeoutId = setTimeout(() => {
      this.googleAuthService.sendGmailMessage(reciever, subject, content);
      console.log("Email has been sent"); }, timeLeft);
  }

  postMessage() {
    this.newMessage.emit(this.gmailsendForm.value.reciever);
    this.newMessage.emit(this.gmailsendForm.value.subject);
    this.newMessage.emit(this.gmailsendForm.value.content);
    this.newMessage.emit(this.gmailsendForm.value.schedule);
  }
}
