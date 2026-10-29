export interface Conference {
  id: number;
  titre: string;
  intervenant: string;
  date: string;
  heure?: string;
  salle?: string;
  categorie?: string;
  placesDisponibles: number;
  totalPlaces?: number;
  description?: string;
  estInscrit?: boolean;
}
