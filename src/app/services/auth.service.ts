import { Injectable, signal, computed } from '@angular/core';

export type UserRole = 'user' | 'admin';

const STORAGE_KEY = 'conftech_role';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Persist role across page reloads via localStorage (with SSR / testing safe check)
  private readonly _role = signal<UserRole>(this.getInitialRole());

  /** Current role (readonly) */
  readonly role = this._role.asReadonly();

  /** Convenience computed booleans */
  readonly isAdmin = computed(() => this._role() === 'admin');
  readonly isUser = computed(() => this._role() === 'user');

  /** Switch to admin mode */
  loginAsAdmin(): void {
    this._role.set('admin');
    this.saveRole('admin');
  }

  /** Switch back to regular user mode */
  loginAsUser(): void {
    this._role.set('user');
    this.saveRole('user');
  }

  /** Toggle between user and admin (handy for demo) */
  toggleRole(): void {
    this._role() === 'admin' ? this.loginAsUser() : this.loginAsAdmin();
  }

  private getInitialRole(): UserRole {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return (window.localStorage.getItem(STORAGE_KEY) as UserRole) ?? 'user';
      }
    } catch {
      // Ignore in non-browser/test environments
    }
    return 'user';
  }

  private saveRole(role: UserRole): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, role);
      }
    } catch {
      // Ignore in non-browser/test environments
    }
  }
}
