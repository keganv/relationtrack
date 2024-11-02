import { createContext } from 'react';
import { AxiosError } from 'axios';
import { Status } from '../types/Status.ts';

export type GlobalContextType = {
  handleError: (e: AxiosError | unknown) => void;
  setStatus: React.Dispatch<React.SetStateAction<Status | null>>;
}

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

export default GlobalContext;