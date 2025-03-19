import { AxiosError } from 'axios';
import { type ReactNode, useCallback,useEffect, useState } from 'react';

import RelationshipContext from '../contexts/RelationshipContext';
import useAuthContext from '../hooks/useAuthContext.ts';
import useGlobalContext from '../hooks/useGlobalContext.ts';
import axios from '../lib/axios';
import type { Relationship, RelationshipFormData, RelationshipFormErrors } from '../types/Relationship';

type RelationshipProviderProps = {
  children: ReactNode;
}

function RelationshipProvider ({ children }: RelationshipProviderProps) {
  const { handleError, setStatus } = useGlobalContext();
  const { user } = useAuthContext();
  const [relationships, setRelationships] = useState<Relationship[]|null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship|null>(null);
  const [types, setTypes] = useState(null);
  const [formErrors, setFormErrors] = useState<RelationshipFormErrors>(null);

  const getRelationships = useCallback(async () => {
    if (user?.relationships) {
      setRelationships(user.relationships);
    } else {
      try {
        const response = await axios.get('/api/relationships');
        setRelationships(response.data);
      } catch (e) {
        handleError(e);
      }
    }
  }, [handleError, user?.relationships]);

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
      const url = data.id ? `/api/relationships/${data.id}` : '/api/relationships';
      const formData = new FormData();

      // THIS IS CRUCIAL TO WORK WITH API - Updates must be PUT
      if (data.id) formData.append('_method', 'PUT');

      for (const [key, value] of Object.entries(data)) {
        if (key === 'images' && value && data.images) {
          for (let i = 0; i < data.images.length; i++) {
            formData.append(`images[${i}]`, data.images[i]);
          }
        } else {
          formData.append(key, value as string);
        }
      }

      const response = await axios({
        url: url,
        data: formData,
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updatedRelationship = response.data.data;

      setSelectedRelationship(updatedRelationship);
      setStatus({type: 'success', message: response.data.message});
      setRelationships((prevRelationships) => {
        const filteredRelations = prevRelationships?.filter((r: Relationship) => r.id !== updatedRelationship.id);
        return [...(filteredRelations ?? []), updatedRelationship];
      });

      return updatedRelationship;
    } catch (error) {
      handleError(error, setFormErrors);

      return error as AxiosError;
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
      const response = await axios.patch(url, {id: id});
      const newPrimaryImage = response.data.data;

      setStatus({type: 'success', message: response.data.message});
      setSelectedRelationship((prevState: Relationship|null) => {
        return prevState ? {...prevState, primary_image: newPrimaryImage, primary_image_id: newPrimaryImage.id } : null;
      });
      setRelationships((prevRelationships: Relationship[]|null) => {
        const updatedRelationships = prevRelationships?.map((r: Relationship) => {
          if (r.id === selectedRelationship?.id) {
            return { ...r, primary_image: newPrimaryImage, primary_image_id: newPrimaryImage.id }
          }
          return r;
        });
        return updatedRelationships ?? [];
      });
    } catch (error) {
      handleError(error, setFormErrors);
    }
  };

  const setRelationshipById = useCallback(async (id: string) => {
    if (!relationships) {
      await getRelationships();
    }
    if (relationships) {
      const relationship = relationships?.find(r => r.id === id);
      if (relationship) {
        setSelectedRelationship(relationship);
      } else {
        setStatus({type: 'error', message: 'No relationship found.'})
      }
    }
  }, [getRelationships, relationships, setStatus]);

  useEffect(() => {
    if (!types) {
      getTypes();
    }
  }, [getTypes, types]);

  useEffect(() => {
    // Reset the form errors when the selected relationship changes
    return () => setFormErrors(null);
  }, [selectedRelationship]);

  return (
    <RelationshipContext.Provider value={{
      save,
      getRelationships,
      relationships,
      setRelationships,
      types,
      formErrors,
      setFormErrors,
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
