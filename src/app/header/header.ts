import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ConferenceService } from '../services/conference.service';
import { NavigationService } from '../services/navigation.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly conferenceService = inject(ConferenceService);
  readonly navigationService = inject(NavigationService);
  readonly authService = inject(AuthService);

  // Programme personnalisé et nombre d'inscriptions
  programme = this.conferenceService.programmePersonnalise;
  nbInscriptions = computed(() => this.programme().length);
}

