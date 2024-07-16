export interface Contact {
  id: number;
  name: string;
  email: string;
  tags?: string; // Optional
  dateOfLastConvo?: string; // Optional
  previewContent?: string; // Optional
}
