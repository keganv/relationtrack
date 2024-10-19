import ActionItem from './ActionItem.ts';
import ApiFile from './ApiFile.ts';

export interface Relationship {
  action_items?: ActionItem[];
  birthday?: string;
  created_at?: string;
  description?: string;
  health: number|string;
  id?: string;
  images?: File[]|object[]|Blob[];
  files?: ApiFile[];
  name: string;
  primary_image?: { id: number, path: string } | null;
  title: string;
  type: { id?: number, type: string };
  updated_at?: string;
}

export type RelationshipFormData = {
  id?: string;
  title: string;
  name: string;
  health: number|string;
  type: string;
  birthday: string;
  description: string;
  images?: File[]|null;
}

export type RelationshipFormErrors = {
  name?: string;
  type?: string;
  health?: string;
  title?: string;
}
