export interface Complaint {
  Id: number;
  Title: string;
  Body: string;
}

export interface TooltipProps {
  visible: boolean;
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export interface FieldProps {
  label?: string;
  children: React.ReactNode;
  htmlFor?: string;
  error?: {
    message: string;
  };
}

export interface ComplaintFormProps {
  onSubmitSuccess: (data: FormData) => Promise<boolean>;
  isSubmitting: boolean;
  submitError: string;
}

export interface FormData {
  title: string;
  body: string;
}

export interface ComplaintsListProps {
  complaints: Complaint[];
  isLoading: boolean;
  fetchError: string;
}
