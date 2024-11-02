import { ReactNode, useCallback, useState, } from "react";
import GlobalContext from "../contexts/GlobalContext";
import { Status } from "../types/Status";

const DISALLOWED_STATUS_MESSAGES = ['sql', 'connection', 'select', 'from', 'where'];

type GlobalProviderProps = { children: ReactNode; }

const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [status, setStatus] = useState<Status | null>(null);

  const handleError = useCallback((e: AxiosError | unknown) => {
    if (e instanceof AxiosError) {
      const message = e.response?.data.message || e.message;
      const allowMessage = !DISALLOWED_STATUS_MESSAGES.find(status => message.includes(status));
      setErrors(e.response?.data.errors || { error: [e.message] });
      setStatus({ type: 'error', message: allowMessage ? message : 'Uh oh! Something went wrong.' });
    }
  }, [setErrors, setStatus]);

  return (
    <GlobalContext.Provider value={{ handleError, setStatus }}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalProvider;