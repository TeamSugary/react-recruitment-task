import { create } from "zustand";

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

export interface Complain {
  Id: number;
  Title: string;
  Body: string;
}

interface ComplainStore {
  complains: Complain[];
  isLoading: boolean;
  isSaving: boolean;
  errorMessage: string;
  successMessage: string;
  fetchComplains: () => Promise<void>;
  addComplain: (title: string, body: string) => Promise<void>;
  clearMessages: () => void;
}

export const useComplainStore = create<ComplainStore>((set, get) => ({
  complains: [],
  isLoading: false,
  isSaving: false,
  errorMessage: "",
  successMessage: "",

  fetchComplains: async () => {
    set({ isLoading: true, errorMessage: "" });
    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      if (!response.ok) throw new Error("Failed to fetch complaints.");
      
      const data = await response.json();
      set({ complains: data });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error loading complaints.";
      set({ errorMessage: message });
    } finally {
      set({ isLoading: false });
    }
  },

  addComplain: async (title: string, body: string) => {
    set({ isSaving: true, errorMessage: "" });
    try {
      const response = await fetch(`${baseUrl}${savePath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Title: title, Body: body }),
      });

      const data = await response.json();
      if (!data.Success) throw new Error("Failed to save complaint.");

      set({
        successMessage: "Complaint submitted successfully!",
        errorMessage: "",
      });

      await get().fetchComplains();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error saving complaint.";
      set({ errorMessage: message });
    } finally {
      set({ isSaving: false });
    }
  },

  clearMessages: () => set({ errorMessage: "", successMessage: "" }),
}));