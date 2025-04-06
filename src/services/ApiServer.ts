import { Complaint, ComplaintInput, ApiResponse } from "../types/types";

const BASE_URL = "https://sugarytestapi.azurewebsites.net/";
const LIST_PATH = "TestApi/GetComplains";
const SAVE_PATH = "TestApi/SaveComplain";

class ApiService {
  async getComplaints(): Promise<Complaint[]> {
    try {
      const response = await fetch(`${BASE_URL}${LIST_PATH}`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch complaints. Status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API Service error fetching complaints:", error);
      throw error;
    }
  }

  async saveComplaint(complaint: ComplaintInput): Promise<ApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}${SAVE_PATH}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complaint),
      });

      if (!response.ok) {
        throw new Error(`Failed to save complaint. Status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (!data.Success) {
        throw new Error(data.Message || "Failed to save complaint.");
      }

      return data;
    } catch (error) {
      console.error("API Service error saving complaint:", error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
