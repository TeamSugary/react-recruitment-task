import { createContext } from "react";
import { Complain } from "../interfaces/types/types";

type AppContextType = {
  complains: Complain[];
  setComplains: React.Dispatch<React.SetStateAction<Complain[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isSaving: boolean;
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  refetchComplains: boolean;
  setRefetchComplains: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppContext = createContext<AppContextType | null>(null);

export default AppContext;
