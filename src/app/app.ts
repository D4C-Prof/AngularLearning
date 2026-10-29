import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { PersonalSchedule } from './personal-schedule/personal-schedule';
import { NavigationService } from './services/navigation.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    Header,
    PersonalSchedule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly navigationService = inject(NavigationService);

  // Tiroir latéral d'accès rapide au programme personnalisé
  isScheduleDrawerOpen = this.navigationService.isScheduleDrawerOpen;

  closeDrawer(): void {
    this.navigationService.closeScheduleDrawer();
  }
}

