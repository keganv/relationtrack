import { AxiosError } from 'axios';
import { createContext } from 'react';

import type { Status } from '../types/Status.ts';

export interface GlobalContextType {
  doLogout: boolean;
  handleError: <T>(e: AxiosError | unknown, setErrorsFn?: (arg: T) => void) => void;
  status: Status | null;
  setStatus: React.Dispatch<React.SetStateAction<Status | null>>;
}

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

export default GlobalContext;
