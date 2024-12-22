import { useState } from 'react';
import axios from '../lib/axios';
import useGlobalContext from './useGlobalContext.ts';


export default function useApiHook() {
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>();
  const { handleError } = useGlobalContext();

  const postData = async <T extends object>(url: string, data: T) => {
    try {
      await axios.post(url, data);
    } catch (e) {
      handleError(e, setApiErrors);
    }
  }

  return { apiErrors, postData };
}
