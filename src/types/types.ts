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

export interface ComplaintFormProps {
  onComplaintSubmitted: () => void;
}

export interface ComplaintListProps {
  complaints: Complaint[] | null;
  isLoading: boolean;
  error: string | null;
}

export interface ExtendedComplaintListProps extends ComplaintListProps {
  onRefresh: () => void;
}
