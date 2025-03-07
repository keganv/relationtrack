import { z } from 'zod';

export type ActionItem = {
  action: string;
  complete?: boolean;
  created_at: string;
  id: number | 0;
  relationship_id: string|null;
  updated_at: string;
  user_id: string;
}

export const actionItemFormSchema = z.object({
  id: z.number().nullish(),
  action: z.string().min(10, 'The action item must be at least 10 characters.').max(100),
  complete: z.boolean().optional(),
});

export type ActionItemFormData = z.infer<typeof actionItemFormSchema>;
