import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MessageComponent } from './components/message/message.component';
import { IndexComponent } from './pages/index/index.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LogoutComponent } from './auth//logout/logout.component';
import { MaterialModule } from './material.module';
import { GoogleLoginComponent } from './auth/google-login/google-login.component';
import { GoogleAuthService } from './services/google-auth.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ContactComponent } from './components/contact/contact.component';
import { GmailScheduleService } from './services/gmail-schedule.service';
import { GmailScheduleComponent } from './pages/gmail-schedule/gmail-schedule.component';
import { GmailFetchComponent } from './pages/gmail-fetch/gmail-fetch.component';
import { ContactService } from './services/contact.service';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    MessageComponent,
    IndexComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    LogoutComponent,
    GoogleLoginComponent,
    DashboardComponent,
    GmailScheduleComponent,
    GmailFetchComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  providers: [GoogleAuthService, GmailScheduleService, ContactService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
