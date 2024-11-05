import { createContext } from 'react';
import { AxiosError } from 'axios';
import { Status } from '../types/Status.ts';

export interface GlobalContextType {
  doLogout: boolean;
  handleError: (e: AxiosError | unknown, setErrorsFn?: (arg: object[]) => void) => void;
  status: Status | null;
  setStatus: React.Dispatch<React.SetStateAction<Status | null>>;
}

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

export default GlobalContext;
