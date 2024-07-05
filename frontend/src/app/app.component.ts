import { Component } from '@angular/core';
import { AuthToggleService } from './services/auth-toggle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Net-Nurture';

  isLoginVisible = true;
  isSignupVisible = false;

  constructor(private authToggleService: AuthToggleService) {}

  ngOnInit(): void {
    this.authToggleService.isLoginVisible$.subscribe(
      (isVisible) => (this.isLoginVisible = isVisible),
    );
    this.authToggleService.isSignupVisible$.subscribe(
      (isVisible) => (this.isSignupVisible = isVisible),
    );
  }
}
