import { AxiosError } from 'axios';
import React, { createContext } from 'react';

import type { Relationship, RelationshipFormData, RelationshipFormErrors } from '../types/Relationship';

export type RelationshipContextValues = {
  save: (data: RelationshipFormData) => Promise<{message: string, data: Relationship}|AxiosError>;
  relationships: Relationship[]|null;
  getRelationships: () => Promise<void>;
  setRelationships: React.Dispatch<React.SetStateAction<Relationship[] | null>>;
  selectedRelationship: Relationship|null;
  setSelectedRelationship: React.Dispatch<React.SetStateAction<Relationship | null>>;
  setRelationshipById: (id: string) => void;
  setPrimaryImageForRelationship: (id: string) => void;
  types: { id: number, type: string }[]|null;
  formErrors: RelationshipFormErrors|null;
  setFormErrors: React.Dispatch<React.SetStateAction<RelationshipFormErrors | null>>;
  convertRelationshipToFormData: (data: Relationship) => RelationshipFormData;
}

const RelationshipContext = createContext<RelationshipContextValues>({} as RelationshipContextValues);

export default RelationshipContext;
