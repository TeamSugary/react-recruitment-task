import { Complain } from "../interfaces/types/types";
import { ReactNode, useContext, useState } from "react";
import AppContext from "./AppContext";
import { handleError } from "../utils/errorHandler";
import { toast } from "react-toastify";

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

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required!");
      setErrorMessage("Title is required!");
      return;
    }
    if (!body.trim()) {
      toast.error("Body is required!");
      setErrorMessage("Body is required!");
      return;
    }
    try {
      setIsSaving(true);
      const response = await fetch(`${baseUrl}${savePath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Title: title,
          Body: body,
        }),
      });
      const data = await response.json();
      // if (!data.Success) throw new Error(data.Message);

      if (!data.Success) {
        if (
          data.Message?.includes("String or binary data would be truncated")
        ) {
          toast.error("Complaint is too long. Please shorten your message.");
          throw new Error(
            "Complaint is too long. Please shorten your message."
          );
        } else {
          toast.error(data.Message || "Failed to save complaint.");
        }
        throw new Error(data.Message || "Failed to save complaint.");
      }
      setTitle("");
      setBody("");
      setErrorMessage("");
      toast.success("Complaint submitted successfully!");
      setRefetchComplains(!refetchComplains);
    } catch (e) {
      setErrorMessage(handleError(e));
    } finally {
      setIsSaving(false);
    }
  };
  
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
        handleSubmit,
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
