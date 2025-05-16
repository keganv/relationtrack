import type { AxiosResponse } from 'axios';
import { useCallback, useState } from 'react';

import axios from '../lib/axios';
import useGlobalContext from './useGlobalContext.ts';

export default function useApi() {
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>();
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useGlobalContext();

  const sendData = useCallback(async <T extends object>(url: string, payload: T, method: 'POST' | 'PUT') => {
    setIsLoading(true);
    try {
      const { data } = await axios({ url: url, method: method, data: payload });
      setApiErrors(undefined);
      return data;
    } catch (e) {
      handleError(e, setApiErrors);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getData = useCallback(async (url: string) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(url);
      setApiErrors(undefined);
      return data;
    } catch (e) {
      handleError(e, setApiErrors);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const deleteData = useCallback(async (url: string): Promise<AxiosResponse | null> => {
    setIsLoading(true);
    try {
      return await axios.delete(url);
    } catch (e) {
      handleError(e, setApiErrors);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  return { apiErrors, deleteData, getData, isLoading, sendData };
}
