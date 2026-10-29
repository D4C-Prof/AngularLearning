import { CommonModule } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ConferenceService } from '../services/conference.service';
import { Conference } from '../models/conference.model';

@Component({
  selector: 'app-conference-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './conference-create.html',
  styleUrl: './conference-create.css',
})
export class ConferenceCreate {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly conferenceService = inject(ConferenceService);

  // Output event emitted to any parent that listens
  conferenceCreee = output<Conference>();

  // List of available categories
  readonly categories = [
    'Frontend',
    'IA & Data',
    'Langages',
    'Sécurité',
    'DevOps & Cloud',
    'Design & UX',
    'Mobile & IoT',
    'Architecture',
  ];

  // Reactive form definition
  form: FormGroup = this.fb.group({
    titre: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(150)],
    ],
    intervenant: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
    ],
    categorie: ['Frontend', Validators.required],
    date: ['', Validators.required],
    heure: [''],
    salle: [''],
    placesDisponibles: [
      25,
      [Validators.required, Validators.min(1), Validators.max(500)],
    ],
    description: ['', Validators.maxLength(600)],
  });

  // Feedback signals
  submitted = signal(false);
  successConference = signal<Conference | null>(null);
  saving = signal(false);
  conferenceModel: any = { categorie: 'Frontend', placesDisponibles: 25 };

  // ── Helpers for cleaner template access ──
  get f() {
    return this.form.controls;
  }

  fieldInvalid(name: string): boolean {
    const ctrl = this.form.get(name)!;
    return ctrl.invalid && (ctrl.touched || this.submitted());
  }

  hasError(name: string, error: string): boolean {
    return !!this.form.get(name)?.hasError(error);
  }

  // ── Actions ──
  onSubmit(fakeForm?: unknown): void {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    this.saving.set(true);

    this.conferenceService.ajouterConference({
      titre: v.titre.trim(),
      intervenant: v.intervenant.trim(),
      date: v.date,
      heure: v.heure?.trim() || undefined,
      salle: v.salle?.trim() || undefined,
      categorie: v.categorie,
      placesDisponibles: Number(v.placesDisponibles),
      totalPlaces: Number(v.placesDisponibles),
      description: v.description?.trim() || undefined,
    }).subscribe({
      next: (created) => {
        this.saving.set(false);
        this.successConference.set(created);
        this.conferenceCreee.emit(created);
        this.router.navigate(['/catalogue']);
      },
      error: (err) => {
        this.saving.set(false);
        console.error('[ConferenceCreate] POST failed:', err);
        alert('Erreur lors de l\'ajout. Vérifiez que json-server tourne sur le port 3000.');
      },
    });
  }

  reinitialiser(): void {
    this.form.reset({ categorie: 'Frontend', placesDisponibles: 25 });
    this.submitted.set(false);
    this.successConference.set(null);
  }

  voirDansCatalogue(): void {
    this.router.navigate(['/catalogue']);
  }

  annuler(): void {
    this.router.navigate(['/catalogue']);
  }
}

