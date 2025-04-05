export interface Complaint {
  Id: string;
  Title: string;
  Body: string;
  CreatedAt?: string;
}

export interface ApiResponse {
  Success: boolean;
  Message?: string;
}
