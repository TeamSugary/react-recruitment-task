import { Complaint, FormData } from "../types";

const API_CONFIG = {
  baseUrl: "https://sugarytestapi.azurewebsites.net/",
  endpoints: {
    list: "TestApi/GetComplains",
    save: "TestApi/SaveComplain",
  },
};

interface ApiResponse {
  Success: boolean;
  Message?: string;
  Id?: number;
}

export const fetchComplaints = async (): Promise<Complaint[]> => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.list}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch complaints: ${response.status}`);
  }

  return (await response.json()) as Complaint[];
};

export const saveComplaint = async (
  formData: FormData
): Promise<ApiResponse> => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.save}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Title: formData.title,
        Body: formData.body,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Server responded with status: ${response.status}`);
  }

  const data = (await response.json()) as ApiResponse;

  if (!data.Success) {
    throw new Error(data.Message || "Failed to save complaint.");
  }

  return data;
};
