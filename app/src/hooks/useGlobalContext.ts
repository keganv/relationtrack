import { useContext } from "react";

import GlobalContext, { type GlobalContextType } from "../contexts/GlobalContext";

export default function useGlobalContext(): GlobalContextType {
  const context = useContext(GlobalContext);

  if (!Object.keys(context).length) {
    throw new Error("useGlobalContext must be used within an AuthProvider.");
  }

  return context;
}
