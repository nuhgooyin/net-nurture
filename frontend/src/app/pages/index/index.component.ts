import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Message } from '../../classes/message';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  messages: Message[] = [];
  error: string = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {}
}
