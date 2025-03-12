import { useContext } from "react";

import AuthContext, { type AuthContextValues } from "../contexts/AuthContext";

export default function useAuthContext(): AuthContextValues {
  const context = useContext(AuthContext);

  if (!Object.keys(context).length) {
    throw new Error("useAuthContext must be used within an AuthProvider.");
  }

  return context;
}
