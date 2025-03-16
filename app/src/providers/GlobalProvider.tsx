import { AxiosError } from "axios";
import { type ReactNode, useCallback, useEffect, useState, } from "react";
import toast from 'react-hot-toast';

import GlobalContext from "../contexts/GlobalContext";
import type { Status } from "../types/Status";

type GlobalProviderProps = { children: ReactNode; }

const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [doLogout, setDoLogout] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    if (status) {
      status.type === 'error' ? toast.error(status.message) : toast.success(status.message);
    }
    return () => toast.dismiss();
  }, [status]);

  const handleError = useCallback(<T,>(e: AxiosError | unknown, setErrorsCallback?: (arg: T) => void) => {
    if (e instanceof AxiosError) {
      const message = e.response?.data.message || e.message;
      if (e.status === 401) {
        setDoLogout(true);
        return setStatus({ type: 'error', message: 'Your session has ended. Please log back in.'});
      }
      if (setErrorsCallback) {
        setErrorsCallback(e.response?.data?.errors || {errors: [message]});
      }
      setStatus({ type: 'error', message: message ?? 'Uh oh! Something went wrong.' });
    }
  }, [setStatus]);

  return (
    <GlobalContext.Provider value={{ doLogout, handleError, status, setStatus }}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalProvider;
