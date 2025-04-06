import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';

interface Complaint {
  Id: number;
  Title: string;
  Body: string;
  CreatedAt: string;
}

interface ApiResponse<T> {
  Success: boolean;
  Data?: T;
  Message?: string;
}

interface FormErrors {
  title?: string;
  body?: string;
}

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>Please refresh the page and try again</p>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Format date helper function
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return 'Invalid date';
    }
  };

  // Memoized validation function
  const validateForm = useCallback((title: string, body: string): FormErrors => {
    const errors: FormErrors = {};
    
    // Remove any HTML tags and excessive whitespace
    const cleanTitle = title.replace(/<[^>]*>/g, '').trim();
    const cleanBody = body.replace(/<[^>]*>/g, '').trim();
    
    if (!cleanTitle) {
      errors.title = 'Title is required';
    } else if (cleanTitle.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    } else if (cleanTitle.length > 100) {
      errors.title = 'Title must be less than 100 characters';
    }

    if (!cleanBody) {
      errors.body = 'Complaint details are required';
    } else if (cleanBody.length < 10) {
      errors.body = 'Complaint details must be at least 10 characters';
    } else if (cleanBody.length > 1000) {
      errors.body = 'Complaint details must be less than 1000 characters';
    }

    return errors;
  }, []);

  // Sanitize text helper function
  const sanitizeText = (text: string) => {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  };

  // Memoized fetch function
  const fetchComplaints = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      console.log('Fetching complaints from:', `${baseUrl}${listPath}`);
      
      const response = await fetch(`${baseUrl}${listPath}`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (Array.isArray(data)) {
        setComplaints(data);
      } 
      else if (data.Success && Array.isArray(data.Data)) {
        setComplaints(data.Data);
      }
      else if (Array.isArray(data.Data)) {
        setComplaints(data.Data);
      }
      else {
        console.error('Unexpected response format:', data);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred while loading complaints');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoized submit handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanTitle = sanitizeText(title);
    const cleanBody = sanitizeText(body);
    
    const errors = validateForm(cleanTitle, cleanBody);
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage(""); // Clear any existing success message
      
      const response = await fetch(`${baseUrl}${savePath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Title: cleanTitle,
          Body: cleanBody,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save complaint');
      }

      const data: ApiResponse<Complaint> = await response.json();
      if (data.Success) {
        setSuccessMessage('Complaint submitted successfully!');
        // Set a timeout to clear the success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
        
        setTitle('');
        setBody('');
        setFormErrors({});
        fetchComplaints();
      } else {
        throw new Error(data.Message || 'Failed to save complaint');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred while submitting the complaint');
    } finally {
      setIsSaving(false);
    }
  }, [title, body, validateForm, fetchComplaints]);

  // Memoized sorted complaints
  const sortedComplaints = useMemo(() => {
    return [...complaints].sort((a, b) => 
      new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()
    );
  }, [complaints]);

  // Cleanup on unmount
  useEffect(() => {
    fetchComplaints();
    return () => {
      // Cleanup function
      setComplaints([]);
      setErrorMessage("");
      setSuccessMessage("");
    };
  }, [fetchComplaints]);

  return (
    <ErrorBoundary>
      <div className="app-container">
        <header className="app-header">
          <h1>Complaint Management</h1>
        </header>

        <main className="app-main">
          <section className="complaint-form-section">
            <h2>Submit a Complaint</h2>
            <form onSubmit={handleSubmit} className="complaint-form">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter complaint title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSaving}
                  required
                  aria-invalid={!!formErrors.title}
                  aria-describedby={formErrors.title ? "title-error" : undefined}
                />
                {formErrors.title && (
                  <span id="title-error" className="error-text">
                    {formErrors.title}
                  </span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="body">Complaint Details</label>
                <textarea
                  id="body"
                  placeholder="Describe your complaint"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  disabled={isSaving}
                  required
                  aria-invalid={!!formErrors.body}
                  aria-describedby={formErrors.body ? "body-error" : undefined}
                />
                {formErrors.body && (
                  <span id="body-error" className="error-text">
                    {formErrors.body}
                  </span>
                )}
              </div>

              {errorMessage && (
                <div className="error-message" role="alert">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="success-message" role="status">
                  {successMessage}
                </div>
              )}

              <button 
                type="submit" 
                className="submit-button"
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="loading-spinner">Submitting...</span>
                ) : (
                  'Submit Complaint'
                )}
              </button>
            </form>
          </section>

          <section className="complaints-list-section">
            <h2>Complaints List</h2>
            
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner">Loading complaints...</div>
              </div>
            ) : sortedComplaints.length > 0 ? (
              <div className="complaints-grid">
                {sortedComplaints.map((complaint) => (
                  <article key={complaint.Id} className="complaint-card">
                    <div className="complaint-content">
                      <h3>{sanitizeText(complaint.Title)}</h3>
                      <div className="complaint-text">
                        {sanitizeText(complaint.Body)}
                      </div>
                    </div>
                    <div className="complaint-footer">
                      <time dateTime={complaint.CreatedAt}>
                        {formatDate(complaint.CreatedAt)}
                      </time>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="no-complaints">No complaints available.</p>
            )}
          </section>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;