export enum Language {
  EN = 'EN',
  ES = 'ES'
}

export enum DocType {
  PDF = 'PDF',
  JPG = 'JPG',
  PNG = 'PNG'
}

export interface DocumentMetadata {
  id: string;
  title: string;
  originalTitle?: string; // For keeping original language title
  description: string;
  date: string; // ISO string YYYY-MM-DD
  year: number;
  category: string;
  tags: string[];
  type: DocType;
  thumbnailUrl: string;
  content: string; // Simulated OCR content
}

export interface FilterState {
  category: string | null;
  year: number | null;
  tag: string | null;
}

export type TranslationCache = Record<string, string>;
