import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthToggleService {
  private isLoginVisibleSubject = new BehaviorSubject<boolean>(false);
  private isSignupVisibleSubject = new BehaviorSubject<boolean>(false);

  isLoginVisible$ = this.isLoginVisibleSubject.asObservable();
  isSignupVisible$ = this.isSignupVisibleSubject.asObservable();

  toggleLogin(): void {
    this.isLoginVisibleSubject.next(!this.isLoginVisibleSubject.value);
    if (this.isLoginVisibleSubject.value) {
      this.isSignupVisibleSubject.next(false);
    }
  }

  toggleSignup(): void {
    this.isSignupVisibleSubject.next(!this.isSignupVisibleSubject.value);
    if (this.isSignupVisibleSubject.value) {
      this.isLoginVisibleSubject.next(false);
    }
  }
}
