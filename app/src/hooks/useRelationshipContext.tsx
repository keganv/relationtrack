import { useContext } from 'react';
import { RelationshipContext, RelationshipContextValues } from '../services/RelationshipService';

export default function useRelationshipContext(): RelationshipContextValues {
  return useContext(RelationshipContext);
}
