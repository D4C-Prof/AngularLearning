import { Routes } from '@angular/router';
import { ConferenceList } from './conference-list/conference-list';
import { Dashboard } from './dashboard/dashboard';
import { Profile } from './profile/profile';
import { ConferenceCreate } from './conference-create/conference-create';

export const routes: Routes = [
  { path: '', redirectTo: 'catalogue', pathMatch: 'full' },
  { path: 'catalogue', component: ConferenceList },
  { path: 'conference/new', component: ConferenceCreate },
  { path: 'dashboard', component: Dashboard },
  { path: 'profil', component: Profile },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
];

