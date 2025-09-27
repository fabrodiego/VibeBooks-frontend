import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Feed } from './pages/feed/feed'

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'feed', component: Feed }
];
