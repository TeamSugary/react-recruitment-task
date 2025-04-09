import { Complaint, ApiResponse } from "../types/complaint";
import { API } from "./apiConfig";

export const getComplaints = async (): Promise<Complaint[]> => {
  const res = await fetch(`${API.BASE_URL}${API.ENDPOINTS.LIST}`);
  if (!res.ok) throw new Error("Failed to fetch complaints");
  const data: Complaint[] = await res.json();
  return data;
};

export const saveComplaint = async (
  title: string,
  body: string
): Promise<void> => {
  const res = await fetch(`${API.BASE_URL}${API.ENDPOINTS.SAVE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Title: title, Body: body }),
  });

  const result: ApiResponse<Complaint[]> = await res.json();

  if (!result.Success) {
    throw new Error(result.Message || "Failed to save complaint.");
  }
};
