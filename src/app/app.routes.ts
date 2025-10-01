import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { FeedComponent } from './pages/feed/feed';
import { SignupComponent } from './pages/signup/signup';
import { authGuard } from './guards/auth-guard';
import { ProfileComponent } from './pages/profile/profile';
import { AddBookComponent } from './pages/add-book/add-book';
import { SearchComponent } from './pages/search/search';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  { path: 'feed', component: FeedComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'add-book', component: AddBookComponent, canActivate: [authGuard] },
  { path: 'search', component: SearchComponent, canActivate: [authGuard] },

  { path: '', redirectTo: '/feed', pathMatch: 'full' },
  { path: '**', redirectTo: '/feed' }
];
