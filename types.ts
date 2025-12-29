export interface LinkItem {
  id: string;
  label: string;
  subLabel: string;
  description?: string; // Nova descrição para o Modal
  url: string;
  image: string; // Desktop image
  mobileImage: string; // Mobile image
  category?: string;
}

export interface MousePosition {
  x: number;
  y: number;
}