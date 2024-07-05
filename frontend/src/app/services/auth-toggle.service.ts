import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthToggleService {
  private isLoginVisibleSubject = new BehaviorSubject<boolean>(true);
  private isSignupVisibleSubject = new BehaviorSubject<boolean>(false);

  isLoginVisible$ = this.isLoginVisibleSubject.asObservable();
  isSignupVisible$ = this.isSignupVisibleSubject.asObservable();

  showLogin(): void {
    this.isLoginVisibleSubject.next(true);
    this.isSignupVisibleSubject.next(false);
  }

  showSignup(): void {
    this.isLoginVisibleSubject.next(false);
    this.isSignupVisibleSubject.next(true);
  }
}
