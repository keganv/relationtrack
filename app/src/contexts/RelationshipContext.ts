import { createContext } from 'react';

import { Relationship, RelationshipFormData, RelationshipFormErrors } from '../types/Relationship';

export interface RelationshipContextValues {
  save: (data: RelationshipFormData) => void,
  relationships: Relationship[]|null,
  selectedRelationship: Relationship|null,
  setSelectedRelationship: React.Dispatch<React.SetStateAction<Relationship | null>>,
  setRelationshipById: (id: string) => void,
  setPrimaryImageForRelationship: (id: string) => void,
  types: { id: number, type: string }[]|null,
  formErrors: RelationshipFormErrors|null,
  convertRelationshipToFormData: (data: Relationship) => RelationshipFormData,
}

const RelationshipContext = createContext<RelationshipContextValues>({} as RelationshipContextValues);

export default RelationshipContext;
