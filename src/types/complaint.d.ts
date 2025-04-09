export interface Complaint {
  Id?: number;
  Title: string;
  Body: string;
}

export interface ApiResponse<T> {
  Success: boolean;
  Data: T;
  Message?: string;
}
