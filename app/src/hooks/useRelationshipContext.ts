import { useContext } from 'react';

import RelationshipContext, { type RelationshipContextValues } from '../contexts/RelationshipContext';

export default function useRelationshipContext(): RelationshipContextValues {
  const context = useContext(RelationshipContext);

  if (!Object.keys(context).length) {
    throw new Error("useRelationshipContext must be used within a RelationshipProvider.");
  }

  return context;
}
