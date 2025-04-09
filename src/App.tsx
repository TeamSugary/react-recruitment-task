import { useState, useEffect, useCallback } from 'react';
import { toast, Toaster } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import './App.css'; 

// API endpoints 
const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";
const savePath = "TestApi/SaveComplain";

// Define complaint structure
interface Complaint {
  Id: string;
  Title: string;
  Body: string;
}

function App() {
  // State management
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  
  const styles = {
    // Main container
    container: `
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem 1rem;
      text-align: center;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      position: relative;
      z-index: 1;
    `,
    // Animated gradient background
    gradientBackground: `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, #0a0a0e 0%, #1A1F2C 50%, #0a0a0e 100%);
      background-size: 400% 400%;
      animation: gradientAnimation 15s ease infinite;
      z-index: -1;
    `,
    // Header section 
    header: `
      margin-bottom: 2.5rem;
      text-align: center;
    `,
    headerTitle: `
      font-size: clamp(1.8rem, 5vw, 2.5rem);
      font-weight: bold;
      color: #9b87f5;
      margin-bottom: 0.5rem;
      text-shadow: 0 0 10px rgba(155, 135, 245, 0.5);
    `,
    headerSubtitle: `
      font-size: clamp(0.8rem, 3vw, 1rem);
      color: #7E69AB;
    `,
    // Main layout 
    mainLayout: `
      display: flex;
      flex-direction: column;
      gap: 2rem;
      align-items: center;
      width: 100%;
    `,
    // Section containers
    section: `
      margin-bottom: 1.5rem;
      width: 100%;
      max-width: 800px;
    `,
    sectionTitle: `
      font-size: clamp(1.2rem, 4vw, 1.5rem);
      font-weight: 600;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      color: #9b87f5;
      text-align: center;
      justify-content: center;
    `,
    // Form styling
    form: `
      background-color: #1A1F2C;
      border-radius: 8px;
      padding: 1.75rem;
      box-shadow: 0 0 20px rgba(155, 135, 245, 0.2);
      border: 1px solid #7E69AB;
      margin-bottom: 1.5rem;
      width: 100%;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    `,
    formGroup: `
      margin-bottom: 1.5rem;
      text-align: center;
    `,
    label: `
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: #9b87f5;
      text-align: left;
    `,
    // Input styling
    input: `
      width: 100%;
      padding: 0.75rem;
      background-color: rgba(0, 0, 0, 0.4);
      color: #fff;
      border: 1px solid #7E69AB;
      border-radius: 6px;
      font-size: 1rem;
      transition: all 0.2s ease;
      box-sizing: border-box;
    `,
    inputFocus: `
      outline: none;
      border-color: #9b87f5;
      box-shadow: 0 0 0 3px rgba(155, 135, 245, 0.3);
    `,
    // Textarea styling
    textarea: `
      width: 100%;
      padding: 0.75rem;
      background-color: rgba(0, 0, 0, 0.4);
      color: #fff;
      border: 1px solid #7E69AB;
      border-radius: 6px;
      font-size: 1rem;
      min-height: 120px;
      resize: vertical;
      transition: all 0.2s ease;
      box-sizing: border-box;
    `,
    // Button styling
    button: `
      width: 100%;
      background: linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%);
      color: white;
      border: none;
      border-radius: 6px;
      padding: 0.9rem 1rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    `,
    buttonHover: `
      box-shadow: 0 0 15px rgba(155, 135, 245, 0.5);
      transform: translateY(-2px);
    `,
    buttonDisabled: `
      opacity: 0.7;
      cursor: not-allowed;
    `,
    // Error styling
    errorMessage: `
      background-color: rgba(229, 62, 62, 0.1);
      border: 1px solid rgba(229, 62, 62, 0.3);
      color: #e53e3e;
      padding: 0.75rem;
      border-radius: 6px;
      margin-top: 1rem;
      display: flex;
      align-items: flex-start;
    `,
    errorIcon: `
      margin-right: 0.5rem;
      margin-top: 0.125rem;
    `,
    // Complaints grid 
    complaintsGrid: `
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      width: 100%;
      justify-content: center;
    `,
    // Complaint card - smaller size
    complaintCard: `
      background-color: #1A1F2C;
      border-radius: 8px;
      padding: 1.25rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      border: 1px solid #7E69AB;
      transition: all 0.3s ease;
      height: 160px;
      overflow-y: auto;
    `,
    complaintCardHover: `
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(155, 135, 245, 0.15);
      border-color: #9b87f5;
    `,
    complaintTitle: `
      font-weight: 600;
      font-size: 1.125rem;
      margin-bottom: 0.7rem;
      color: #9b87f5;
    `,
    complaintBody: `
      font-size: 0.9rem;
      color: #d1d1d1;
      white-space: pre-line;
      line-height: 1.5;
    `,
    // Loading indicator
    loadingContainer: `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 0;
      color: #7E69AB;
      width: 100%;
    `,
    spinner: `
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
      color: #9b87f5;
    `,
    // Empty state
    emptyState: `
      background-color: #1A1F2C;
      border-radius: 8px;
      padding: 2.5rem;
      text-align: center;
      border: 1px solid #7E69AB;
      max-width: 600px;
      margin: 0 auto;
      width: 100%;
    `,
    emptyStateText: `
      color: #9b87f5;
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    `,
    emptyStateSubtext: `
      color: #7E69AB;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    `,
    // Various elements
    loaderIcon: `
      width: 1.5rem;
      height: 1.5rem;
      animation: spin 1s linear infinite;
      margin-right: 0.5rem;
    `,
    // Refresh button
    refreshButton: `
      background: none;
      border: none;
      color: #9b87f5;
      font-size: 0.875rem;
      cursor: pointer;
      padding: 0.5rem 1rem;
      margin-top: 1rem;
      border-radius: 4px;
      border: 1px solid #7E69AB;
      transition: all 0.2s ease;
    `,
    refreshButtonHover: `
      background-color: rgba(155, 135, 245, 0.1);
    `,
    // Animation keyframes
    keyframes: {
      spin: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `,
      fadeIn: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `,
      // gradient animation for background
      gradientAnimation: `
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `
    }
  };

  // Helper function to parse inline styles
  function parseInlineStyles(stylesString: string): Record<string, string> {
    if (!stylesString || typeof stylesString !== 'string') {
      return {};
    }
    
    const styleLines = stylesString.trim().split('\n');
    const styleObject: Record<string, string> = {};
    
    styleLines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      const colonIndex = trimmedLine.indexOf(':');
      if (colonIndex === -1) return;
      
      const property = trimmedLine.substring(0, colonIndex).trim();
      let value = trimmedLine.substring(colonIndex + 1).trim();
      
      // Remove semicolon if it exists
      if (value.endsWith(';')) {
        value = value.substring(0, value.length - 1);
      }
      
      // Convert to camelCase for React styling
      const camelCaseProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      
      styleObject[camelCaseProperty] = value;
    });
    
    return styleObject;
  }

  // Fetch complaints from the API
  const fetchComplaints = useCallback(async () => {
    
    setIsLoading(true);
    setError(null);
    
    try {
      
      const response = await fetch(`${baseUrl}${listPath}`);
      
      
      if (!response.ok) {
        throw new Error(`Failed to fetch complaints: ${response.status}`);
      }
      
      
      const data = await response.json();
      setComplaints(data);
    } catch (err) {
     
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      toast.error("Failed to load complaints", {
        description: message
      });
    } finally {
      
      setIsLoading(false);
    }
  }, []);

  // Form input handlers
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  // Submit complaint form
  const handleSubmit = async (e: React.FormEvent) => {
   
    e.preventDefault();
    
    // Validate form inputs
    if (!title.trim() || !body.trim()) {
      toast.error("Please fill all fields", {
        description: "Both title and description are required"
      });
      return;
    }
    
    // Show submission state
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Send data to the API
      const response = await fetch(`${baseUrl}${savePath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Title: title,
          Body: body,
        }),
      });
      
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      
      const data = await response.json();
      
      
      if (!data.Success) {
        throw new Error(data.Message || "Failed to save complaint.");
      }
      
      // Handle successful submission
      toast.success("Complaint submitted successfully");
      setTitle("");
      setBody("");
      fetchComplaints();
    } catch (err) {
      
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      toast.error("Failed to submit complaint", {
        description: message
      });
    } finally {
      
      setIsSubmitting(false);
    }
  };

  
  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Set up animations and styles
  useEffect(() => {
    // Add our keyframes to the document
    const styleElement = document.createElement('style');
    styleElement.textContent = styles.keyframes.spin + styles.keyframes.fadeIn + styles.keyframes.gradientAnimation;
    document.head.appendChild(styleElement);
    
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [styles.keyframes.fadeIn, styles.keyframes.spin, styles.keyframes.gradientAnimation ]);

  // Render an individual complaint card
  const renderComplaintItem = (complaint: Complaint) => (
    <div 
      key={complaint.Id} 
      style={{
        ...parseInlineStyles(styles.complaintCard),
        ...(hoveredCard === complaint.Id ? parseInlineStyles(styles.complaintCardHover) : {}),
        animation: 'fadeIn 0.3s ease-out forwards',
        animationDelay: `${Math.random() * 0.5}s`
      }}
      onMouseEnter={() => setHoveredCard(complaint.Id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <h3 style={parseInlineStyles(styles.complaintTitle)}>{complaint.Title}</h3>
      <p style={parseInlineStyles(styles.complaintBody)}>{complaint.Body}</p>
    </div>
  );

 
  const renderComplaintsList = () => {
    if (isLoading && !complaints.length) {
      return (
        <div style={parseInlineStyles(styles.loadingContainer)}>
          <Loader2 style={{...parseInlineStyles(styles.spinner), width: '2rem', height: '2rem'}} />
          <p>Loading complaints...</p>
        </div>
      );
    }

    if (!complaints.length) {
      return (
        <div style={parseInlineStyles(styles.emptyState)}>
          <p style={parseInlineStyles(styles.emptyStateText)}>No complaints available yet.</p>
          <p style={parseInlineStyles(styles.emptyStateSubtext)}>Be the first to submit feedback!</p>
        </div>
      );
    }

    return (
      <div style={parseInlineStyles(styles.complaintsGrid)}>
        {complaints.map(renderComplaintItem)}
      </div>
    );
  };

  return (
    <div style={parseInlineStyles(styles.container)}>
      {/* Animated gradient background */}
      <div style={parseInlineStyles(styles.gradientBackground)}></div>
      
      {/* Toast notifications system */}
      <Toaster position="top-right" />
      
      {/* Header with title */}
      <header style={parseInlineStyles(styles.header)}>
        <h1 style={parseInlineStyles(styles.headerTitle)}>Sugary LLC Feedback Portal</h1>
        <p style={parseInlineStyles(styles.headerSubtitle)}>Your voice shapes our digital future</p>
      </header>

      <div style={parseInlineStyles(styles.mainLayout)}>
        {/* Form section */}
        <section style={parseInlineStyles(styles.section)}>
          <h2 style={parseInlineStyles(styles.sectionTitle)}>Submit a Complaint</h2>
          <form onSubmit={handleSubmit} style={parseInlineStyles(styles.form)}>
            <div style={parseInlineStyles(styles.formGroup)}>
              <label htmlFor="title" style={parseInlineStyles(styles.label)}>Title</label>
              <input
                id="title"
                type="text"
                placeholder="Brief summary of your complaint"
                value={title}
                onChange={handleTitleChange}
                style={{
                  ...parseInlineStyles(styles.input),
                  ...(focusedInput === 'title' ? parseInlineStyles(styles.inputFocus) : {})
                }}
                onFocus={() => setFocusedInput('title')}
                onBlur={() => setFocusedInput(null)}
                disabled={isSubmitting}
              />
            </div>
            
            <div style={parseInlineStyles(styles.formGroup)}>
              <label htmlFor="body" style={parseInlineStyles(styles.label)}>Description</label>
              <textarea
                id="body"
                placeholder="Please provide details about your complaint"
                value={body}
                onChange={handleBodyChange}
                style={{
                  ...parseInlineStyles(styles.textarea),
                  ...(focusedInput === 'body' ? parseInlineStyles(styles.inputFocus) : {})
                }}
                onFocus={() => setFocusedInput('body')}
                onBlur={() => setFocusedInput(null)}
                rows={5}
                disabled={isSubmitting}
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...parseInlineStyles(styles.button),
                ...(isSubmitting ? parseInlineStyles(styles.buttonDisabled) : {})
              }}
              onMouseOver={(e) => {
                if (!isSubmitting) {
                  Object.assign(e.currentTarget.style, parseInlineStyles(styles.buttonHover));
                }
              }}
              onMouseOut={(e) => {
                Object.assign(e.currentTarget.style, parseInlineStyles(styles.button));
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite', marginRight: '0.5rem' }} />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Complaint</span>
              )}
            </button>
            
            {error && isSubmitting && (
              <div style={parseInlineStyles(styles.errorMessage)}>
                <AlertCircle style={{ ...parseInlineStyles(styles.errorIcon), width: '1.25rem', height: '1.25rem' }} />
                <p>{error}</p>
              </div>
            )}
          </form>
        </section>
        
        {/* Complaints listing section */}
        <section style={parseInlineStyles(styles.section)}>
          <h2 style={parseInlineStyles(styles.sectionTitle)}>
            <span style={{ marginRight: '0.5rem' }}>Recent Complaints</span>
            {isLoading && <Loader2 style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} />}
          </h2>
          
          {error && !isSubmitting && (
            <div style={parseInlineStyles(styles.errorMessage)}>
              <AlertCircle style={{ ...parseInlineStyles(styles.errorIcon), width: '1.25rem', height: '1.25rem' }} />
              <div>
                <p>{error}</p>
                <button 
                  onClick={fetchComplaints}
                  style={{
                    ...parseInlineStyles(styles.refreshButton),
                  }}
                  onMouseOver={(e) => {
                    Object.assign(e.currentTarget.style, parseInlineStyles(styles.refreshButtonHover));
                  }}
                  onMouseOut={(e) => {
                    Object.assign(e.currentTarget.style, parseInlineStyles(styles.refreshButton));
                  }}
                >
                  Try again
                </button>
              </div>
            </div>
          )}
          
          {renderComplaintsList()}
        </section>
      </div>
    </div>
  );
}

export default App;
