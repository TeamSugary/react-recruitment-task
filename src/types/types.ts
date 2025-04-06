export interface Complaint {
  Id: number;
  Title: string;
  Body: string;
}

export interface ComplaintInput {
  Title: string;
  Body: string;
}

export interface ApiResponse {
  Success: boolean;
  Message?: string;
  Data?: unknown;
}
