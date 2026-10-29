import { Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Conference } from '../models/conference.model';
import { ConferenceService } from '../services/conference.service';

@Component({
  selector: 'app-conference-detail',
  imports: [CommonModule],
  templateUrl: './conference-detail.html',
  styleUrl: './conference-detail.css',
})
export class ConferenceDetail {
  protected readonly conferenceService = inject(ConferenceService);

  // ─── PARENT -> ENFANT ───
  conference = input<Conference | null>(null);

  // ─── ENFANT -> PARENT (@Output) ───
  inscrireConference = output<number>();
  annulerConference = output<number>();

  // Statut d'inscription réactif
  estInscrit = computed(() => this.conference()?.estInscrit ?? false);

  // Réservation de place via service
  onInscrire(): void {
    const conf = this.conference();
    if (conf && conf.placesDisponibles > 0 && !this.estInscrit()) {
      this.conferenceService.inscrire(conf.id);
      this.inscrireConference.emit(conf.id);
    }
  }

  // Annulation de réservation via service
  onAnnuler(): void {
    const conf = this.conference();
    if (conf && this.estInscrit()) {
      this.conferenceService.annulerInscription(conf.id);
      this.annulerConference.emit(conf.id);
    }
  }
}
