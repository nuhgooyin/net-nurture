import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Message } from '../../classes/message';
import { AuthToggleService } from '../../services/auth-toggle.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  messages: Message[] = [];
  error: string = '';

  constructor(
    private api: ApiService,
    private authToggleService: AuthToggleService,
  ) {}

  ngOnInit(): void {
    this.getMessages();
  }

  getMessages() {
    this.api.getMessages().subscribe((response) => {
      this.messages = response.messages;
    });
  }

  toggleSignup(): void {
    this.authToggleService.toggleSignup();
  }
}
