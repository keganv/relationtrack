import { useContext } from "react";
import GlobalContext, { GlobalContextType } from "../contexts/GlobalContext";

export default function useGlobalContext(): GlobalContextType {
  const context = useContext(GlobalContext);

  if (context === undefined) {
    throw new Error("useGlobalContext must be used within an AuthProvider.");
  }

  return context;
}
