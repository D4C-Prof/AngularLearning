import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Conference as ConferenceItemComponent } from '../conference/conference';
import { ConferenceDetail } from '../conference-detail/conference-detail';
import { ConferenceService } from '../services/conference.service';
import { NavigationService } from '../services/navigation.service';
import { Conference } from '../models/conference.model';

@Component({
  selector: 'app-conference-list',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ConferenceItemComponent,
    ConferenceDetail,
  ],
  templateUrl: './conference-list.html',
  styleUrl: './conference-list.css',
})
export class ConferenceList {
  // ─── SERVICES PUBLICS UTILISÉS PAR LE TEMPLATE ───
  readonly conferenceService = inject(ConferenceService);
  readonly navigationService = inject(NavigationService);

  // Signaux exposés depuis le service (alimentés directement par httpResource)
  readonly conferences = this.conferenceService.filteredConferences;
  readonly selectedConference = this.conferenceService.selectedConference;
  readonly categories = this.conferenceService.categories;
  readonly selectedCategory = this.conferenceService.selectedCategory;
  readonly searchQuery = this.conferenceService.searchQuery;
  readonly filterInscritsOnly = this.conferenceService.filterInscritsOnly;

  // Fonctions de délégation directes vers les services
  onSelectConference(conference: Conference): void {
    this.conferenceService.selectConference(conference);
  }

  onInscrireConference(conferenceId: number): void {
    this.conferenceService.inscrire(conferenceId);
  }

  onAnnulerConference(conferenceId: number): void {
    this.conferenceService.annulerInscription(conferenceId);
  }

  setCategory(category: string): void {
    this.conferenceService.setCategory(category);
  }

  toggleInscritsFilter(): void {
    this.conferenceService.toggleInscritsFilter();
  }

  resetFilters(): void {
    this.conferenceService.resetFilters();
  }
}
