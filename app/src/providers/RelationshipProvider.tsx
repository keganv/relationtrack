import { ReactNode, useState, useEffect, useCallback } from 'react';
import axios from '../lib/axios';
import RelationshipContext from '../contexts/RelationshipContext';
import { Relationship, RelationshipFormData, RelationshipFormErrors } from '../types/Relationship';
import useGlobalContext from '../hooks/useGlobalContext.ts';

type RelationshipProviderProps = {
  children: ReactNode;
}

function RelationshipProvider ({ children }: RelationshipProviderProps) {
  const { handleError, setStatus } = useGlobalContext();
  const [relationships, setRelationships] = useState<Relationship[]|null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship|null>(null);
  const [types, setTypes] = useState(null);
  const [formErrors, setFormErrors] = useState<RelationshipFormErrors>(null);

  const all = useCallback(async () => {
    try {
      const response = await axios.get('/api/relationships');
      setRelationships(response.data);
    } catch (e) {
      handleError(e);
    }
  }, [handleError]);

  const getTypes = useCallback(async () => {
    try {
      const response = await axios.get('/api/relationships/types');
      setTypes(response.data);
    } catch (e) {
      handleError(e);
    }
  }, [handleError]);

  const save = async (data: RelationshipFormData) => {
    setFormErrors(null);
    try {
      const formData = new FormData();

      for (const [key, value] of Object.entries(data)) {
        if (key === 'images' && value && data.images) {
          for (let i = 0; i < data.images.length; i++) {
            formData.append(`images[${i}]`, data.images[i]);
          }
        } else {
          formData.append(key, value as string);
        }
      }

      const url = data.id ? `/api/relationships/${data.id}` : '/api/relationships';
      const response = await axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      setStatus({type: 'success', message: response.data.message});
      await all();
    } catch (error) {
      handleError(error, setFormErrors);
    }
  };

  const convertRelationshipToFormData = (relationship: Relationship): RelationshipFormData => {
    return {
      id: relationship.id ?? undefined,
      title: relationship.title,
      name: relationship.name,
      health: relationship.health,
      type: relationship.type.id.toString(),
      birthday: relationship.birthday ?? '',
      description: relationship.description ?? '',
    }
  };

  const setPrimaryImageForRelationship = async (id: string) => {
    try {
      const url = `/api/relationships/${selectedRelationship?.id}/primary-image`;
      const response = await axios.post(url, {id: id});
      setStatus({type: 'success', message: response.data.message});
    } catch (error) {
      handleError(error, setFormErrors);
    }
  };

  const setRelationshipById = useCallback((id: string) => {
    if (relationships) {
      const relationship = relationships?.find(r => r.id === id);
      if (relationship) {
        setSelectedRelationship(relationship);
      } else {
        setStatus({type: 'error', message: 'No relationship found.'})
      }
    }
  }, [relationships, setStatus]);

  useEffect(() => {
    if (!relationships) {
      all();
    }
    if (!types) {
      getTypes();
    }
  }, [all, getTypes, relationships, types]);

  return (
    <RelationshipContext.Provider value={{
      save,
      relationships,
      types,
      formErrors,
      convertRelationshipToFormData,
      selectedRelationship,
      setSelectedRelationship,
      setRelationshipById,
      setPrimaryImageForRelationship
    }}>
      {children}
    </RelationshipContext.Provider>
  );
}

export default RelationshipProvider;
