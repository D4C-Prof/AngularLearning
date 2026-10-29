import { HttpClient, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Conference } from '../models/conference.model';

const API_URL = 'http://localhost:3000/events';

@Injectable({
  providedIn: 'root',
})
export class ConferenceService {
  private readonly http = inject(HttpClient);

  // ─── SOURCE DE VÉRITÉ CENTRALE (HTTP RESOURCE) ───
  // Charge automatiquement les données sans avoir besoin d'appeler .subscribe()
  readonly conferencesResource = httpResource<Conference[]>(() => API_URL, {
    defaultValue: [],
  });

  // Conférence sélectionnée identifiée par son ID (calculée réactivement)
  private readonly _selectedId = signal<number | null>(null);

  // État de recherche, filtres et affichage du formulaire de création
  private readonly _searchQuery = signal<string>('');
  private readonly _selectedCategory = signal<string>('Toutes');
  private readonly _filterInscritsOnly = signal<boolean>(false);
  private readonly _isCreateFormOpen = signal<boolean>(false);

  // Signaux d'état fournis nativement par httpResource
  readonly loading = this.conferencesResource.isLoading;
  readonly error = this.conferencesResource.error;

  // ─── LECTURE PUBLIQUE (SIGNALS) ───
  readonly conferences = this.conferencesResource.value;

  readonly selectedConference = computed(() => {
    const list = this.conferences();
    const id = this._selectedId();
    if (id !== null) {
      const found = list.find((c) => c.id === id);
      if (found) return found;
    }
    return list.length > 0 ? list[0] : null;
  });

  readonly searchQuery = this._searchQuery.asReadonly();
  readonly selectedCategory = this._selectedCategory.asReadonly();
  readonly filterInscritsOnly = this._filterInscritsOnly.asReadonly();
  readonly isCreateFormOpen = this._isCreateFormOpen.asReadonly();

  // ─── COMPUTED SIGNALS ───

  /** Programme personnalisé (inscriptions actives de l'utilisateur) */
  readonly programmePersonnalise = computed(() =>
    this.conferences().filter((conf) => conf.estInscrit === true)
  );

  /** Catégories uniques disponibles */
  readonly categories = computed(() => {
    const cats = new Set<string>();
    this.conferences().forEach((c) => {
      if (c.categorie) cats.add(c.categorie);
    });
    return ['Toutes', ...Array.from(cats)];
  });

  /** Conférences filtrées selon les critères de recherche et catégories */
  readonly filteredConferences = computed(() => {
    const query = this._searchQuery().toLowerCase().trim();
    const cat = this._selectedCategory();
    const inscritsOnly = this._filterInscritsOnly();

    return this.conferences().filter((conf) => {
      const matchQuery =
        !query ||
        conf.titre.toLowerCase().includes(query) ||
        conf.intervenant.toLowerCase().includes(query) ||
        (conf.description && conf.description.toLowerCase().includes(query));

      const matchCat = cat === 'Toutes' || conf.categorie === cat;
      const matchInscrits = !inscritsOnly || conf.estInscrit === true;

      return matchQuery && matchCat && matchInscrits;
    });
  });

  /** Statistiques calculées en temps réel */
  readonly statistiques = computed(() => {
    const list = this.conferences();
    const inscrits = this.programmePersonnalise();
    const placesRestantes = list.reduce((total, c) => total + c.placesDisponibles, 0);

    return {
      totalConferences: list.length,
      nbInscriptions: inscrits.length,
      placesRestantes,
      prochaineConference: inscrits.length > 0 ? inscrits[0] : null,
    };
  });

  // ─── ACTIONS SUR LE RESOURCE ───

  /** Recharge la ressource depuis l'API */
  reload(): void {
    this.conferencesResource.reload();
  }

  // ─── FONCTIONS MÉTIER ET ACTIONS LIÉES AUX BOUTONS ───

  /** Sélectionne une conférence pour afficher ses détails */
  selectConference(conference: Conference | null): void {
    this._selectedId.set(conference ? conference.id : null);
  }

  /**
   * Inscrit l'utilisateur à une conférence (PATCH /events/:id).
   * Met à jour la ressource locale immédiatement (optimistic update via update()).
   */
  inscrire(conferenceId: number): boolean {
    const list = this.conferences();
    const conf = list.find((c) => c.id === conferenceId);
    if (!conf || conf.placesDisponibles <= 0 || conf.estInscrit) return false;

    const patch: Partial<Conference> = {
      placesDisponibles: conf.placesDisponibles - 1,
      estInscrit: true,
    };

    // Optimistic local update sur le httpResource
    this._updateLocal(conferenceId, patch);

    // Persist to json-server
    this.http.patch<Conference>(`${API_URL}/${conferenceId}`, patch).subscribe({
      error: (err) => {
        // Rollback en cas d'erreur
        this._updateLocal(conferenceId, {
          placesDisponibles: conf.placesDisponibles,
          estInscrit: false,
        });
        console.error('[ConferenceService] PATCH inscrire failed:', err);
      },
    });

    return true;
  }

  /**
   * Annule l'inscription (PATCH /events/:id).
   * Met à jour la ressource locale immédiatement (optimistic update via update()).
   */
  annulerInscription(conferenceId: number): boolean {
    const list = this.conferences();
    const conf = list.find((c) => c.id === conferenceId);
    if (!conf || !conf.estInscrit) return false;

    const patch: Partial<Conference> = {
      placesDisponibles: conf.placesDisponibles + 1,
      estInscrit: false,
    };

    // Optimistic local update sur le httpResource
    this._updateLocal(conferenceId, patch);

    // Persist to json-server
    this.http.patch<Conference>(`${API_URL}/${conferenceId}`, patch).subscribe({
      error: (err) => {
        // Rollback en cas d'erreur
        this._updateLocal(conferenceId, {
          placesDisponibles: conf.placesDisponibles,
          estInscrit: true,
        });
        console.error('[ConferenceService] PATCH annuler failed:', err);
      },
    });

    return true;
  }

  /**
   * Ajoute une nouvelle conférence (POST /events).
   * Met à jour directement httpResource avec le nouvel élément.
   */
  ajouterConference(nouvelle: Omit<Conference, 'id'>): Observable<Conference> {
    const body: Omit<Conference, 'id'> = {
      ...nouvelle,
      estInscrit: false,
      totalPlaces: nouvelle.totalPlaces ?? nouvelle.placesDisponibles,
    };

    return this.http.post<Conference>(API_URL, body).pipe(
      tap((created) => {
        this.conferencesResource.update((list) => [created, ...list]);
        this._selectedId.set(created.id);
      })
    );
  }

  /**
   * Supprime une conférence (DELETE /events/:id).
   * Retire l'élément de httpResource immédiatement (optimistic delete).
   */
  supprimerConference(conferenceId: number): void {
    const snapshot = this.conferences();

    // Optimistic remove sur le httpResource
    this.conferencesResource.update((list) => list.filter((c) => c.id !== conferenceId));

    // Persist to json-server
    this.http.delete(`${API_URL}/${conferenceId}`).subscribe({
      error: (err) => {
        // Rollback en cas d'erreur
        this.conferencesResource.set(snapshot);
        console.error('[ConferenceService] DELETE failed:', err);
      },
    });
  }

  // ─── FILTRES ───

  /** Mise à jour de la requête de recherche */
  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }

  /** Efface la recherche textuelle (bouton ✕) */
  clearSearch(): void {
    this._searchQuery.set('');
  }

  /** Sélectionne une catégorie pour filtrer le catalogue */
  setCategory(category: string): void {
    this._selectedCategory.set(category);
  }

  /** Bascule le filtre des conférences inscrites */
  toggleInscritsFilter(): void {
    this._filterInscritsOnly.set(!this._filterInscritsOnly());
  }

  /** Réinitialise tous les filtres de recherche */
  resetFilters(): void {
    this._searchQuery.set('');
    this._selectedCategory.set('Toutes');
    this._filterInscritsOnly.set(false);
  }

  /** Ouvre le formulaire de création de conférence */
  ouvrirCreation(): void {
    this._isCreateFormOpen.set(true);
  }

  /** Ferme le formulaire de création de conférence */
  fermerCreation(): void {
    this._isCreateFormOpen.set(false);
  }

  /** Bascule l'affichage du formulaire de création */
  toggleCreateForm(): void {
    this._isCreateFormOpen.set(!this._isCreateFormOpen());
  }

  /** Vérifie si l'utilisateur est inscrit à une conférence */
  estInscrit(conferenceId: number): boolean {
    const conf = this.conferences().find((c) => c.id === conferenceId);
    return !!conf?.estInscrit;
  }

  // ─── PRIVÉ ───

  /** Applique un patch partiel sur un élément de la ressource */
  private _updateLocal(id: number, patch: Partial<Conference>): void {
    this.conferencesResource.update((list) =>
      list.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  }
}
