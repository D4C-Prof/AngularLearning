import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ConferenceService } from '../services/conference.service';
import { NavigationService } from '../services/navigation.service';
import { PersonalSchedule } from '../personal-schedule/personal-schedule';
import { Conference } from '../models/conference.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, PersonalSchedule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  readonly conferenceService = inject(ConferenceService);
  readonly navigationService = inject(NavigationService);

  // Données réactives exposées par le service
  statistiques = this.conferenceService.statistiques;
  conferences = this.conferenceService.conferences;
  programme = this.conferenceService.programmePersonnalise;

  // Conférences recommandées
  suggestions = computed(() =>
    this.conferences()
      .filter((c) => !c.estInscrit && c.placesDisponibles > 0)
      .slice(0, 3)
  );

  // Méthodes utilisant les services
  naviguerVersCatalogue(): void {
    this.navigationService.naviguerVersCatalogue();
  }

  inscrireSuggestion(conf: Conference): void {
    this.conferenceService.inscrire(conf.id);
  }

  voirDetails(conf: Conference): void {
    this.conferenceService.selectConference(conf);
    this.navigationService.naviguerVersCatalogue();
  }
}
