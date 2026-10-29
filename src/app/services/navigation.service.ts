import { Injectable, signal } from '@angular/core';

export type SectionType = 'catalogue' | 'dashboard' | 'profil';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  // Section active actuellement affichée (sans routage)
  private readonly _activeSection = signal<SectionType>('catalogue');

  // État du tiroir / modal d'accès rapide au programme personnalisé
  private readonly _isScheduleDrawerOpen = signal<boolean>(false);

  readonly activeSection = this._activeSection.asReadonly();
  readonly isScheduleDrawerOpen = this._isScheduleDrawerOpen.asReadonly();

  /** Change la section active */
  setSection(section: SectionType): void {
    this._activeSection.set(section);
  }

  /** Navigation vers le catalogue */
  naviguerVersCatalogue(): void {
    this._activeSection.set('catalogue');
    this._isScheduleDrawerOpen.set(false);
  }

  /** Navigation vers le tableau de bord */
  naviguerVersDashboard(): void {
    this._activeSection.set('dashboard');
    this._isScheduleDrawerOpen.set(false);
  }

  /** Navigation vers la page profil */
  naviguerVersProfil(): void {
    this._activeSection.set('profil');
    this._isScheduleDrawerOpen.set(false);
  }

  /** Bascule l'état du volet de programme personnalisé */
  toggleScheduleDrawer(forceOpen?: boolean): void {
    if (typeof forceOpen === 'boolean') {
      this._isScheduleDrawerOpen.set(forceOpen);
    } else {
      this._isScheduleDrawerOpen.set(!this._isScheduleDrawerOpen());
    }
  }

  /** Ouvre le volet de programme personnalisé */
  openScheduleDrawer(): void {
    this._isScheduleDrawerOpen.set(true);
  }

  /** Ferme le volet de programme personnalisé */
  closeScheduleDrawer(): void {
    this._isScheduleDrawerOpen.set(false);
  }
}
