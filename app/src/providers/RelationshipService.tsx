import {ReactNode, createContext, useState, useEffect, useCallback} from 'react';
import axios from '../lib/axios';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import Relationship from '../types/Relationship';


export interface RelationshipContextValues {
  save: (data: FormDataModel) => void,
  relationships: Relationship[]|null,
  selectedRelationship: Relationship|null,
  setSelectedRelationship: React.Dispatch<React.SetStateAction<Relationship | null>>,
  setRelationshipById: (id: string) => void,
  setPrimaryImageForRelationship: (id: string) => void,
  types: string[]|null,
  formErrors: FormErrors|null,
  convertToFormData: (data: Relationship) => FormDataModel,
}

export interface FormDataModel {
  id?: string,
  title: string,
  name: string,
  health: number|string,
  type: string,
  birthday: string,
  description: string,
  images?: File[]|null
}

export interface FormErrors {
  name?: string;
  type?: string;
  health?: string;
  title?: string;
}

export const RelationshipContext = createContext<RelationshipContextValues>({} as RelationshipContextValues);

type RelationshipProviderProps = {
  children: ReactNode;
}

export function RelationshipProvider({ children }: RelationshipProviderProps) {
  const navigate = useNavigate();
  const [relationships, setRelationships] = useState<Relationship[]|null>(null);
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship|null>(null);
  const [types, setTypes] = useState<string[]|null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors|null>(null);

  const _setError = useCallback(() => {
   // setStatusError('You do not have access. Please Login.');
    return navigate('/login');
  }, [navigate]);

  const all = useCallback(async () => {
    try {
      const response = await axios.get('/api/relationships');
      setRelationships(response.data);
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 401) {
          _setError();
        }
      }
    }
  }, [_setError]);

  const getTypes = useCallback(async () => {
    try {
      const response = await axios.get('/api/relationships/types');
      setTypes(response.data);
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 401) {
          _setError();
        }
      }
    }
  }, [_setError]);

  const save = async (data: FormDataModel) => {
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

      const url = data.id ? `/api/relationships/${data.id}` : '/api/relationships/';
      const response = await axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' }});

      if (response) {
        // setStatus(response.data.message);
        all();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        // setStatusError(error.response?.data.message);
        setFormErrors(error.response?.data.errors);
      }
    }
  };

  const convertToFormData = useCallback((relationship: Relationship): FormDataModel => {
    return {
      id: relationship.id || '',
      title: relationship.title,
      name: relationship.name,
      health: relationship.health,
      type: relationship.type?.type,
      birthday: relationship.birthday || '',
      description: relationship.description || '',
    }
  }, []);

  const setPrimaryImageForRelationship = async (id: string) => {
    // setStatus(null);
    try {
      const url = `/api/relationships/${selectedRelationship?.id}/primary-image`;
      const response = await axios.post(url, {id: id});
      if (response) {
        // setStatus(response.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        // setStatusError(error.response?.data.message);
      }
    }
  };

  const setRelationshipById = useCallback((id: string) => {
    if (relationships) {
      const relationship = relationships?.find(r => r.id == id);
      if (relationship) {
        setSelectedRelationship(relationship);
      } else {
        // setStatusError('No relationship found.')
      }
    }
  }, [relationships]);

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
      convertToFormData,
      selectedRelationship,
      setSelectedRelationship,
      setRelationshipById,
      setPrimaryImageForRelationship
    }}>
      {children}
    </RelationshipContext.Provider>
  );
}
