type ActionItem = {
  action: string;
  complete: boolean;
  created_at: string;
  id?: number;
  relationship_id: string|null;
  updated_at: string;
  user_id: string;
}

export default ActionItem;
