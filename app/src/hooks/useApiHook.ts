import { useCallback, useState } from 'react';
import axios from '../lib/axios';
import useGlobalContext from './useGlobalContext.ts';


export default function useApiHook() {
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>();
  const { handleError } = useGlobalContext();

  const sendData = useCallback(async <T extends object>(url: string, payload: T, method: 'POST' | 'PUT') => {
    try {
      const { data } = await axios({ method: method, url: url, data: payload });
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
      return await axios.delete(url);
    } catch (e) {
      handleError(e, setApiErrors);
    }
  }, [handleError]);

  return { apiErrors, deleteData, sendData, getData };
}
