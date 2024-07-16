import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MessageComponent } from './components/message/message.component';
import { IndexComponent } from './pages/index/index.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './material.module';
import { AuthToggleService } from './services/auth-toggle.service';
import { GoogleLoginComponent } from './auth/google-login/google-login.component';
import { GoogleAuthService } from './services/google-auth.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ContactComponent } from './components/contact/contact.component';

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    MessageComponent,
    IndexComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    GoogleLoginComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  providers: [provideAnimationsAsync(), AuthToggleService, GoogleAuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
