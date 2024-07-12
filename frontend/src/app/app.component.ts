import { Component, Renderer2 } from '@angular/core';
import { AuthToggleService } from './services/auth-toggle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Net-Nurture';

  isLoginVisible = false;
  isSignupVisible = false;

  constructor(
    private authToggleService: AuthToggleService,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.authToggleService.isLoginVisible$.subscribe((isVisible) => {
      this.isLoginVisible = isVisible;
      this.toggleBlurBackground(isVisible || this.isSignupVisible);
    });
    this.authToggleService.isSignupVisible$.subscribe((isVisible) => {
      this.isSignupVisible = isVisible;
      this.toggleBlurBackground(isVisible || this.isLoginVisible);
    });
  }

  toggleBlurBackground(isBlur: boolean): void {
    if (isBlur) {
      this.renderer.addClass(document.body, 'blur-background');
    } else {
      this.renderer.removeClass(document.body, 'blur-background');
    }
  }
}
