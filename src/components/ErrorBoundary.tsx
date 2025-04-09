import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorInfo: "",
    };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true, errorInfo: "Something went wrong." };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Caught an error!!!", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="wrapper">
          <h2>Something is wrong!</h2>
          <p>{this.state.errorInfo}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
