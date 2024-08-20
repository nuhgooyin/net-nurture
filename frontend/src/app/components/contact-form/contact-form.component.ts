import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Contact } from '../../classes/contact';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
})
export class ContactFormComponent implements OnInit {
  contactForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ContactFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Contact,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data;

    this.contactForm = this.fb.group({
      id: [this.data ? this.data.id : ''],
      name: [this.data ? this.data.name : '', Validators.required],
      email: [
        this.data ? this.data.email : '',
        [Validators.required, Validators.email],
      ],
      tags: [this.data ? this.data.tags : ''],
      lastContacted: [this.data ? this.data.lastContacted : ''],
      summary: [this.data ? this.data.summary : ''],
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.dialogRef.close(this.contactForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
