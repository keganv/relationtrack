import ActionItem from './ActionItem.ts';
import ApiFile from './ApiFile.ts';

export default interface Relationship {
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
