import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout">
      <!-- Admin sub-navigation -->
      <aside class="admin-sidebar">
        <div class="admin-brand">
          <span class="admin-brand-icon">🛡️</span>
          <span class="admin-brand-label">Espace Admin</span>
        </div>

        <nav class="admin-nav">
          <a class="admin-nav-item" routerLink="/catalogue" routerLinkActive="active">
            <span class="anav-icon">🏷️</span> Catalogue
          </a>
          <a class="admin-nav-item" routerLink="/dashboard" routerLinkActive="active">
            <span class="anav-icon">📊</span> Tableau de bord
          </a>
          <a class="admin-nav-item" routerLink="/profil" routerLinkActive="active">
            <span class="anav-icon">👤</span> Mon Profil
          </a>
          <hr class="admin-nav-divider" />
          <span class="admin-nav-section-label">Administration</span>
          <a class="admin-nav-item admin-nav-item--highlight"
             routerLink="/admin/add-conference"
             routerLinkActive="active">
            <span class="anav-icon">➕</span> Ajouter une conférence
          </a>
        </nav>
      </aside>

      <!-- Page content -->
      <main class="admin-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: calc(100vh - 60px);
      background: #f8fafc;
    }

    .admin-sidebar {
      width: 240px;
      min-width: 240px;
      background: #0f172a;
      color: #cbd5e1;
      padding: 1.5rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .admin-brand {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.5rem 0.75rem;
    }

    .admin-brand-icon {
      font-size: 1.4rem;
    }

    .admin-brand-label {
      font-size: 1rem;
      font-weight: 700;
      color: #f8fafc;
      letter-spacing: 0.02em;
    }

    .admin-nav {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .admin-nav-divider {
      border: none;
      border-top: 1px solid #1e293b;
      margin: 0.5rem 0;
    }

    .admin-nav-section-label {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #475569;
      padding: 0 0.75rem;
    }

    .admin-nav-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.6rem 0.75rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      color: #94a3b8;
      text-decoration: none;
      transition: all 0.15s ease;
    }

    .admin-nav-item:hover {
      background: #1e293b;
      color: #f1f5f9;
    }

    .admin-nav-item.active {
      background: #1e3a5f;
      color: #93c5fd;
    }

    .admin-nav-item--highlight {
      color: #fbbf24;
    }

    .admin-nav-item--highlight:hover {
      background: #1e293b;
      color: #fcd34d;
    }

    .admin-nav-item--highlight.active {
      background: #1c1708;
      color: #fcd34d;
    }

    .anav-icon {
      font-size: 1rem;
    }

    .admin-content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .admin-layout {
        flex-direction: column;
      }
      .admin-sidebar {
        width: 100%;
        min-width: unset;
        flex-direction: row;
        flex-wrap: wrap;
        padding: 0.75rem;
        gap: 0.5rem;
      }
      .admin-brand {
        width: 100%;
      }
      .admin-nav {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.25rem;
      }
      .admin-nav-divider,
      .admin-nav-section-label {
        display: none;
      }
      .admin-content {
        padding: 1rem;
      }
    }
  `]
})
export class AdminShellComponent {}
