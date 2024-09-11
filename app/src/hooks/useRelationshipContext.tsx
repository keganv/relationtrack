import { useContext } from 'react';
import { RelationshipContext, RelationshipContextValues } from '../providers/RelationshipService';

export default function useRelationshipContext(): RelationshipContextValues {
  return useContext(RelationshipContext);
}
