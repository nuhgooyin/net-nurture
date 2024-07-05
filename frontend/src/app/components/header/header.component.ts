import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { AuthToggleService } from '../../services/auth-toggle.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  error: string = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private authToggleService: AuthToggleService,
  ) {}

  ngOnInit(): void {}

  toggleLogin(): void {
    this.authToggleService.showLogin();
  }

  toggleSignup(): void {
    this.authToggleService.showSignup();
  }
}
