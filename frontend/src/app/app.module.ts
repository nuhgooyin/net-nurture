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
import { MaterialModule } from './material.module';
import { GoogleLoginComponent } from './auth/google-login/google-login.component';
import { GoogleAuthService } from './services/google-auth.service';
import { GmailSendService } from './services/gmail-send.service';
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
  providers: [GoogleAuthService, GmailSendService],
  bootstrap: [AppComponent],
})
export class AppModule {}
