import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Contact } from '../../classes/contact';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.css'],
})
export class ContactCardComponent {
  @Input() contact!: Contact;

  constructor(
    public dialogRef: MatDialogRef<ContactCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Contact,
  ) {
    this.contact = data;
  }

  closeSummary(): void {
    this.dialogRef.close();
  }
}
