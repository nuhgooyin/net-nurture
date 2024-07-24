import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GmailScheduleService } from '../../services/gmail-schedule.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gmail-schedule',
  templateUrl: './gmail-schedule.component.html',
  styleUrls: ['./gmail-schedule.component.css'],
})
export class GmailScheduleComponent implements OnInit {
  gmailscheduleForm: FormGroup;
  emailAddress = '';
  

  constructor(
    private fb: FormBuilder,
    private gmailScheduleService: GmailScheduleService,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
  ) {
    this.authService.getEmailStatus().subscribe(
      (email: string | null) => {
        if (email === null) {
        } else {
          this.emailAddress = email;
        }
      },
      (error: any) => {
        console.error('Error fetching email status', error);
      },
    )

    this.gmailscheduleForm = this.fb.group({
      sender: [this.emailAddress, Validators.required],
      reciever: ['', Validators.required],
      subject: ['', Validators.required],
      content: ['', Validators.required],
      schedule: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.gmailscheduleForm.valid) {
      const { reciever, subject, content, schedule } = this.gmailscheduleForm.value;
      const scheduledDate = new Date(schedule);
      const timeLeft = scheduledDate.getTime() - Date.now();

      if (timeLeft > 0) {
        this.gmailScheduleService
            .scheduleGmailMessage(this.emailAddress, reciever, subject, content, scheduledDate.getTime())
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
