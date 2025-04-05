import { toast } from "sonner";

export interface Complaint {
  Id: number;
  Title: string;
  Body: string;
}

export interface ComplaintSubmission {
  Title: string;
  Body: string;
}

const BASE_URL = "https://sugarytestapi.azurewebsites.net/";
const LIST_PATH = "TestApi/GetComplains";
const SAVE_PATH = "TestApi/SaveComplain";

export const fetchComplaints = async (): Promise<Complaint[]> => {
  try {
    const response = await fetch(`${BASE_URL}${LIST_PATH}`);

    if (!response.ok) {
      throw new Error(`Error fetching complaints: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch complaints";
    toast.error(errorMessage);
    throw error;
  }
};

export const submitComplaint = async (
  complaint: ComplaintSubmission
): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}${SAVE_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(complaint),
    });

    const data = await response.json();

    if (!data.Success) {
      throw new Error("Failed to save complaint");
    }

    toast.success("Complaint submitted successfully!");
    return true;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to submit complaint";
    toast.error(errorMessage);
    throw error;
  }
};
