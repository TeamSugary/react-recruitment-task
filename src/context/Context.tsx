import { Complain } from "../interfaces/types/types";
import { ReactNode, useContext, useState } from "react";
import AppContext from "./AppContext";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [complains, setComplains] = useState<Complain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [refetchComplains, setRefetchComplains] = useState(false);

  return (
    <AppContext.Provider
      value={{
        complains,
        setComplains,
        isLoading,
        setIsLoading,
        isSaving,
        setIsSaving,
        errorMessage,
        setErrorMessage,
        refetchComplains,
        setRefetchComplains,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
