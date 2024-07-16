import { Component, Renderer2 } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Net-Nurture';

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.logoutOnRestart();
  }
  logoutOnRestart() {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Logout successful on app restart');
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Logout failed on app restart:', error);
      },
    );
  }
}
