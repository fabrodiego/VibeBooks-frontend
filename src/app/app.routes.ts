import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { FeedComponent } from './pages/feed/feed';
import { SignupComponent } from './pages/signup/signup';
import { authGuard } from './guards/auth-guard';
import { ProfileComponent } from './pages/profile/profile';
import { AddBookComponent } from './pages/add-book/add-book';
import { SearchComponent } from './pages/search/search';
import { UpdateProfileComponent } from './components/profile/update-profile/update-profile';
import { ChangePasswordComponent } from './components/profile/password-security/change-password/change-password';
import { ThemeSettingsComponent } from './components/profile/theme/theme-settings';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  { path: 'feed', component: FeedComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'add-book', component: AddBookComponent, canActivate: [authGuard] },
  { path: 'search', component: SearchComponent, canActivate: [authGuard] },

  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: UpdateProfileComponent },
      { path: 'personal-data', component: UpdateProfileComponent },
      { path: 'security', component: ChangePasswordComponent },
      { path: 'theme', component: ThemeSettingsComponent },
    ]
  },

  { path: '', redirectTo: '/feed', pathMatch: 'full' },
  { path: '**', redirectTo: '/feed' }
];
