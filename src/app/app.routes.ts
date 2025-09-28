import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { FeedComponent } from './pages/feed/feed';
import { SignupComponent } from './pages/signup/signup';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'feed',
    component: FeedComponent,
    canActivate: [authGuard]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
