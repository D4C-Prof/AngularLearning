import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ConferenceService } from '../services/conference.service';
import { NavigationService } from '../services/navigation.service';
import { Conference } from '../models/conference.model';

@Component({
  selector: 'app-personal-schedule',
  imports: [CommonModule],
  templateUrl: './personal-schedule.html',
  styleUrl: './personal-schedule.css',
})
export class PersonalSchedule {
  readonly conferenceService = inject(ConferenceService);
  readonly navigationService = inject(NavigationService);

  // Mode d'affichage : 'compact' (pour drawer/en-tête/dashboard) ou 'full' (pour profil ou grand écran)
  mode = input<'compact' | 'full'>('full');

  // Inscriptions réactives depuis le service
  programme = this.conferenceService.programmePersonnalise;

  annuler(confId: number, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.conferenceService.annulerInscription(confId);
  }

  voirConference(conf: Conference): void {
    this.conferenceService.selectConference(conf);
    this.navigationService.setSection('catalogue');
    this.navigationService.closeScheduleDrawer();
  }

  naviguerVersCatalogue(): void {
    this.navigationService.setSection('catalogue');
    this.navigationService.closeScheduleDrawer();
  }
}
