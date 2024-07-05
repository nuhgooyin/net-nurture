import { Component, OnInit } from '@angular/core';
import { AuthToggleService } from '../../services/auth-toggle.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  username: string = '';
  password: string = '';
  isVisible: boolean = false;

  constructor(private authToggleService: AuthToggleService) {}

  ngOnInit(): void {
    this.authToggleService.isSignupVisible$.subscribe(
      (isVisible) => (this.isVisible = isVisible),
    );
  }

  onSubmit(): void {
    // Handle sign-up submission
  }
}
