import { Component, OnInit } from '@angular/core';
import { AuthToggleService } from '../../services/auth-toggle.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  isVisible: boolean = false;

  constructor(private authToggleService: AuthToggleService) {}

  ngOnInit(): void {
    this.authToggleService.isLoginVisible$.subscribe(
      (isVisible) => (this.isVisible = isVisible),
    );
  }

  onSubmit(): void {
    // Handle login submission
  }
}
