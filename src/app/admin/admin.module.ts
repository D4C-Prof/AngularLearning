import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminShellComponent } from './admin-shell/admin-shell.component';
import { AddConferenceComponent } from './add-conference/add-conference.component';

@NgModule({
  imports: [
    AdminShellComponent,
    AddConferenceComponent,
    RouterModule.forChild([
      {
        path: '',
        component: AdminShellComponent,
        children: [
          { path: '', redirectTo: 'add-conference', pathMatch: 'full' },
          { path: 'add-conference', component: AddConferenceComponent },
        ]
      }
    ])
  ],
})
export class AdminModule {}
