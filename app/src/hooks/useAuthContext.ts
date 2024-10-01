import { useContext } from "react";
import AuthContext, { AuthContextValues } from "../contexts/AuthContext";

export default function useAuthContext(): AuthContextValues {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }

  return context;
}
