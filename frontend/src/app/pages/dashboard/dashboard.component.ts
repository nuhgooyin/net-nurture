import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Message } from '../../classes/message';
import { AppComponent } from '../../app.component';
import { Contact } from '../../classes/contact';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  messages: Message[] = [];
  error: string = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {}
}
