import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConferenceService } from '../services/conference.service';
import { NavigationService } from '../services/navigation.service';
import { PersonalSchedule } from '../personal-schedule/personal-schedule';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, PersonalSchedule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  readonly conferenceService = inject(ConferenceService);
  readonly navigationService = inject(NavigationService);

  // Données de l'utilisateur
  user = {
    nom: 'Ben Salem',
    prenom: 'Ahmed',
    email: 'ahmed.bensalem@esprit.tn',
    role: 'Étudiant Ingénieur - Génie Logiciel',
    universite: 'ESPRIT Tech',
    badgeId: 'CONF-2026-8942',
    dateAdhesion: 'Octobre 2026',
  };

  programme = this.conferenceService.programmePersonnalise;

  naviguerVersCatalogue(): void {
    this.navigationService.setSection('catalogue');
  }
}
