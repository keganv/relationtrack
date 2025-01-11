import { useState, useCallback } from 'react';
import axios from '../lib/axios';
import useGlobalContext from './useGlobalContext.ts';


export default function useApiHook() {
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>();
  const { handleError } = useGlobalContext();

  const postData = useCallback(async <T extends object>(url: string, payload: T) => {
    try {
      const { data } = await axios.post(url, payload);
      return data;
    } catch (e) {
      handleError(e, setApiErrors);
    }
  }, [handleError]);

  const getData = useCallback(async (url: string) => {
    try {
      const { data } = await axios.get(url);
      return data;
    } catch (e) {
      handleError(e, setApiErrors);
    }
  }, [handleError]);

  const deleteData = useCallback(async (url: string) => {
    try {
      const { data } = await axios.delete(url);
      return data;
    } catch (e) {
      handleError(e, setApiErrors);
    }
  }, [handleError]);

  return { apiErrors, deleteData, postData, getData };
}
