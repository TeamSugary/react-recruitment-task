import { ReactNode, useContext, useState } from "react";
import AppContext from "./AppContext";
import { Complain } from "../App";


export const AppProvider = ({ children }: { children: ReactNode }) => {
  const baseUrl = "https://sugarytestapi.azurewebsites.net/";
  const listPath = "TestApi/GetComplains";
  const savePath = "TestApi/SaveComplain";
  const [complains, setComplains] = useState<Complain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [refetchComplains, setRefetchComplains] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");


  
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
        baseUrl,
        listPath,
        savePath,
        title,
        setTitle,
        body,
        setBody,
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
