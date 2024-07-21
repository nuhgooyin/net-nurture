import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GmailSendService } from '../../services/gmail-send.service';
import { GmailScheduleService } from '../../services/gmail-schedule.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gmail-send',
  templateUrl: './gmail-send.component.html',
  styleUrls: ['./gmail-send.component.css'],
})
export class GmailSendComponent implements OnInit {
  gmailsendForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private gmailSendService: GmailSendService,
    private gmailScheduleService: GmailScheduleService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.gmailsendForm = this.fb.group({
      reciever: ['', Validators.required],
      subject: ['', Validators.required],
      content: ['', Validators.required],
      schedule: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.gmailsendForm.valid) {
      const { reciever, subject, content, schedule } = this.gmailsendForm.value;
      const scheduledDate = new Date(schedule);
      const timeLeft = scheduledDate.getTime() - Date.now();

      if (timeLeft > 0) {
        this.gmailScheduleService
            .scheduleGmailMessage(reciever, subject, content, scheduledDate.getTime())
            .subscribe(
              (response) => {
                this.snackBar.open('Email scheduled successfully!', 'Close', {
                  duration: 10000,
                });
              },
              (error) => {
                this.snackBar.open(
                  'Error scheduling email: ' + error.error.message,
                  'Close',
                  { duration: 10000 },
                );
              },
            );
        this.router.navigate(['/dashboard']);
      } else {
        this.snackBar.open('Scheduled time must be in the future.', 'Close', {
          duration: 3000,
        });
      }
    } else {
      this.snackBar.open('Please fill in all fields', 'Close', {
        duration: 3000,
      });
    }
  }
}
