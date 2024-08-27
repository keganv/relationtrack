import ActionItem from './ActionItem.tsx';
import API_File from './API_File.tsx';

export default interface Relationship {
  action_items?: ActionItem[];
  birthday?: string;
  created_at?: string;
  description?: string;
  health: number|string;
  id?: string;
  images?: File[]|object[]|Blob[];
  files?: API_File[];
  name: string;
  primary_image?: { id: number, path: string } | null;
  title: string;
  type: { id?: number, type: string };
  updated_at?: string;
}
