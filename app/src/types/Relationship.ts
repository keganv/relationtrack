import { z } from 'zod';

import { checkFileType } from '../lib/helpers';
import type { ActionItem } from './ActionItem.ts';
import type { ApiFile } from './ApiFile.ts';

export interface Relationship {
  action_items?: ActionItem[];
  birthday?: string;
  created_at?: string;
  description?: string;
  health: number;
  id?: string;
  images?: File[]|object[]|Blob[];
  files?: ApiFile[];
  name: string;
  primary_image?: { id: number, path: string } | null;
  title: string;
  type: { id: number, type: string };
  updated_at?: string;
}

export const relationshipFormSchema = z.object({
  id: z.string().nullish(),
  title: z.string().min(3, 'The title must be at least 3 characters long.').default(''),
  type: z.string({ message: 'Please select a type.' }).min(1, 'Please select a type.').default(''),
  name: z.string().min(3, 'The name must be at least 3 characters long.').default(''),
  health: z.coerce.number().default(1),
  birthday: z.string()
    .refine((date) => (new Date(date) >= new Date('1930-01-01')), { message: 'This age is too old.' })
    .refine((date) => (new Date(date) <= new Date()), { message: 'This age is too young.' })
    .optional(),
  description: z.string().max(500, 'Maximum of 500 characters.').nullable(),
  images: z.array(z.instanceof(File))
    .refine((files) => files.every((f) => f.size < 1048576), { message: 'Max 1MB upload size.' })
    .refine((files) => files.every(checkFileType))
    .optional()
});

export type RelationshipFormData = z.infer<typeof relationshipFormSchema>;

export type RelationshipFormErrors = {
  birthday?: string[];
  description?: string[];
  name?: string[];
  type?: string[];
  health?: string[];
  title?: string[];
  images?: string[];
  [key: `images.${number}`]: string[] | undefined;
} | null
