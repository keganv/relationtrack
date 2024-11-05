import { ReactNode, useCallback, useState, } from "react";
import GlobalContext from "../contexts/GlobalContext";
import { Status } from "../types/Status";
import { AxiosError } from "axios";

const DISALLOWED_STATUS_MESSAGES = ['sql', 'connection', 'select', 'from', 'where'];
const UNAUTHORIZED_STRINGS = ['unauthenticated', 'unauthorized', 'csrf'];

type GlobalProviderProps = { children: ReactNode; }

const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [doLogout, setDoLogout] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);

  const handleError = useCallback((e: AxiosError | unknown, setErrorsFn?: (arg: object[]) => void) => {
    if (e instanceof AxiosError) {
      const message = e.response?.data.message || e.message;
      const allowMessage = !DISALLOWED_STATUS_MESSAGES.some(status => message.toLowerCase().includes(status));
      const unauthorized = UNAUTHORIZED_STRINGS.some(str => message.toLowerCase().includes(str));
      if (unauthorized && (e.status === 401)) {
        setDoLogout(true);
        return setStatus({ type: 'error', message: 'Your session has ended. Please log back in.'});
      }
      if (setErrorsFn) {
        setErrorsFn(e.response?.data.errors || {error: [e.message]});
      }
      setStatus({ type: 'error', message: allowMessage ? message : 'Uh oh! Something went wrong.' });
    }
  }, [setStatus]);

  return (
    <GlobalContext.Provider value={{ doLogout, handleError, status, setStatus }}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalProvider;
