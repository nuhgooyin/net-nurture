import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { GmailScheduleComponent } from './pages/gmail-schedule/gmail-schedule.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { CreditsComponent } from './pages/credits/credits.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'gmail-schedule',
    component: GmailScheduleComponent,
  },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'credits', component: CreditsComponent },
  {
    path: '',
    component: IndexComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
