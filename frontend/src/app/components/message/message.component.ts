import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from '../../classes/message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() message!: Message;

  constructor() {}

  ngOnInit(): void {}

}
