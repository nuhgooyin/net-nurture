export interface Contact {
  id: number;
  name: string;
  email: string;
  tags?: string; // Optional
  lastContacted?: string; // Optional
  summary?: string; // Optional
}
