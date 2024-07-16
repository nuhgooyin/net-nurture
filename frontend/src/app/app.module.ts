import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { GmailSendComponent } from './pages/gmail-send/gmail-send.component';

@NgModule({
  declarations: [
    AppComponent,
    MessageComponent,
    IndexComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    GoogleLoginComponent,
    GmailSendComponent,
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
  exports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
  ],
  providers: [provideAnimationsAsync(), AuthToggleService, GoogleAuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
