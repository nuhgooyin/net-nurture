import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-gmail-fetch-dialog',
  templateUrl: './gmail-fetch-dialog.component.html',
  styleUrls: ['./gmail-fetch-dialog.component.css'],
})
export class GmailFetchDialogComponent {
  emailCount: number = 100;
  emailFolder: string = '';
  maxPerContact: number = 5;

  constructor(
    public dialogRef: MatDialogRef<GmailFetchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onFetch(): void {
    this.dialogRef.close({
      emailCount: this.emailCount,
      emailFolder: this.emailFolder,
      maxPerContact: this.maxPerContact,
    });
  }
}
