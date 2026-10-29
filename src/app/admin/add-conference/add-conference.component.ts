import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConferenceService } from '../../services/conference.service';
import { Conference } from '../../models/conference.model';

@Component({
  selector: 'app-add-conference',
  standalone: true,
  templateUrl: './add-conference.component.html',
  styleUrls: ['./add-conference.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class AddConferenceComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly router = inject(Router);
  private readonly conferenceService = inject(ConferenceService);

  // Reactive form definition
  form: FormGroup = this.fb.group({
    titre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
    intervenant: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    categorie: ['Frontend', Validators.required],
    date: ['', Validators.required],
    heure: [''],
    salle: [''],
    placesDisponibles: [25, [Validators.required, Validators.min(1), Validators.max(500)]],
    description: ['', Validators.maxLength(600)],
  });

  submitted = false;
  successConference: Conference | null = null;

  get f() {
    return this.form.controls;
  }

  fieldInvalid(name: string): boolean {
    const ctrl = this.form.get(name)!;
    return ctrl.invalid && (ctrl.touched || this.submitted);
  }

  hasError(name: string, error: string): boolean {
    return !!this.form.get(name)?.hasError(error);
  }

  saving = false;

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    this.saving = true;

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
        this.saving = false;
        this.successConference = created;
        this.router.navigate(['/catalogue']);
      },
      error: (err) => {
        this.saving = false;
        console.error('[AddConference] POST failed:', err);
        alert('Erreur lors de l\'ajout. Vérifiez que json-server tourne sur le port 3000.');
      },
    });
  }

  reset(): void {
    this.form.reset({ categorie: 'Frontend', placesDisponibles: 25 });
    this.submitted = false;
    this.successConference = null;
  }
}
