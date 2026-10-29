import { Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Conference as ConferenceModel } from '../models/conference.model';
import { ConferenceService } from '../services/conference.service';
import { AuthService } from '../services/auth.service';

// Fonction utilitaire de réduction du nombre de places (conservée pour rétrocompatibilité)
export function reduirePlaces(conf: ConferenceModel): ConferenceModel {
  if (conf.placesDisponibles > 0 && !conf.estInscrit) {
    return {
      ...conf,
      placesDisponibles: conf.placesDisponibles - 1,
      estInscrit: true,
    };
  }
  return conf;
}

@Component({
  selector: 'app-conference',
  imports: [CommonModule],
  templateUrl: './conference.html',
  styleUrl: './conference.css',
})
export class Conference {
  // ─── SERVICE INJECTÉ ───
  readonly conferenceService = inject(ConferenceService);
  readonly authService = inject(AuthService);

  // ─── PARENT -> ENFANT (@Input / input()) ───
  conference = input.required<ConferenceModel>();
  isSelected = input<boolean>(false);

  // ─── ENFANT -> PARENT (@Output / output()) ───
  selectConference = output<ConferenceModel>();
  inscrireConference = output<number>();
  annulerConference = output<number>();
  supprimerConference = output<number>();

  // Propriétés dérivées réactives
  titre = computed(() => this.conference().titre);
  intervenant = computed(() => this.conference().intervenant);
  date = computed(() => this.conference().date);
  heure = computed(() => this.conference().heure);
  salle = computed(() => this.conference().salle);
  categorie = computed(() => this.conference().categorie);
  placesDisponibles = computed(() => this.conference().placesDisponibles);
  estInscrit = computed(() => this.conference().estInscrit ?? false);

  // ─── ACTIONS UTILISANT LE SERVICE ───
  reduirePlaces(): void {
    const conf = this.conference();
    if (conf.placesDisponibles > 0 && !conf.estInscrit) {
      this.conferenceService.inscrire(conf.id);
      this.inscrireConference.emit(conf.id);
    }
  }

  onSelect(): void {
    const conf = this.conference();
    this.conferenceService.selectConference(conf);
    this.selectConference.emit(conf);
  }

  onInscrire(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.reduirePlaces();
  }

  onAnnuler(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    const conf = this.conference();
    this.conferenceService.annulerInscription(conf.id);
    this.annulerConference.emit(conf.id);
  }

  onSupprimer(event?: MouseEvent): void {
    if (event) event.stopPropagation();
    const conf = this.conference();
    if (!confirm(`Supprimer « ${conf.titre} » ? Cette action est irréversible.`)) return;
    this.conferenceService.supprimerConference(conf.id);
    this.supprimerConference.emit(conf.id);
  }
}
