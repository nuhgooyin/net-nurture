import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Contact } from '../../classes/contact';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  @Input() contact!: Contact;

  constructor() {}

  ngOnInit(): void {}
}
