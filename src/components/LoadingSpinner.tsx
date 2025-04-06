import "../styles/LoadingSpinner.css";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
}

export const LoadingSpinner = ({ size = "medium" }: LoadingSpinnerProps) => {
  return <div className={`loader ${size}`} aria-label="Loading"></div>;
};
