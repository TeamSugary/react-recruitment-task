import { useState, useEffect } from 'react';

interface Complaint {
  Id: number;
  Title: string;
  Body: string;
  CreatedAt?: string;
  Status?: 'Pending' | 'In Progress' | 'Resolved';
}

function App() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const baseUrl = "https://sugarytestapi.azurewebsites.net/";
  const listPath = "TestApi/GetComplains";
  const savePath = "TestApi/SaveComplain";

  const colors = {
    background: '#121212',
    surface: '#1E1E1E',
    card: '#252525',
    primary: '#BB86FC',
    primaryHover: '#A370D9',
    text: '#E1E1E1',
    textSecondary: '#A0A0A0',
    error: '#CF6679',
    success: '#4CAF50',
    pending: '#FFA000',
    inProgress: '#2196F3',
    resolved: '#4CAF50',
    border: '#333333',
    divider: '#383838'
  };

  const styles = {
    container: {
      backgroundColor: colors.background,
      minHeight: '100vh',
      padding: '2rem',
      color: colors.text,
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '2rem',
      color: colors.primary
    },
    section: {
      backgroundColor: colors.surface,
      padding: '2rem',
      borderRadius: '8px',
      marginBottom: '2rem',
      border: `1px solid ${colors.border}`
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: `1px solid ${colors.border}`,
      borderRadius: '6px',
      marginBottom: '1rem',
      backgroundColor: colors.card,
      color: colors.text,
      resize: 'vertical' as const
    },
    button: {
      padding: '0.75rem 1.5rem',
      backgroundColor: colors.primary,
      color: '#000',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '500'
    },
    buttonHover: {
      backgroundColor: colors.primaryHover
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
      marginTop: '1.5rem'
    },
    card: {
      padding: '1.5rem',
      borderRadius: '10px',
      backgroundColor: colors.card,
      border: `1px solid ${colors.border}`,
      transition: 'transform 0.2s ease, box-shadow 0.3s ease',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-between',
      minHeight: '220px'
    },
    cardHover: {
      transform: 'translateY(-5px)',
      boxShadow: `0 5px 20px rgba(0,0,0,0.4)`
    },
    status: (status?: string) => ({
      padding: '0.3rem 0.6rem',
      borderRadius: '4px',
      fontSize: '0.8rem',
      fontWeight: '600',
      backgroundColor:
        status === 'Resolved' ? 'rgba(76, 175, 80, 0.1)' :
        status === 'In Progress' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(255, 160, 0, 0.1)',
      color:
        status === 'Resolved' ? colors.resolved :
        status === 'In Progress' ? colors.inProgress : colors.pending
    }),
    bodyClamp: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 4,
      WebkitBoxOrient: 'vertical' as const,
      marginBottom: '1rem',
      color: colors.textSecondary,
      fontSize: '0.95rem'
    },
    message: {
      padding: '1rem',
      borderRadius: '4px',
      marginTop: '1rem'
    },
    error: {
      backgroundColor: 'rgba(207, 102, 121, 0.1)',
      color: colors.error
    },
    success: {
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      color: colors.success
    }
  };

  const fetchComplaints = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      if (!response.ok) throw new Error('Failed to fetch complaints');
      const data = await response.json();
      setComplaints(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load complaints');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(`${baseUrl}${savePath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Title: title, Body: body }),
      });

      if (!response.ok) throw new Error('Failed to save complaint');

      setSuccess("Complaint submitted successfully!");
      setTitle("");
      setBody("");
      await fetchComplaints();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit complaint");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Today";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return "Today";
    }
  };

  const filteredComplaints = complaints.filter(complaint =>
    complaint.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.Body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Complaint Management System</h1>
      </header>

      <section style={styles.section}>
        <h2 style={{ color: colors.text }}>Submit a Complaint</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Complaint title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />
          <textarea
            placeholder="Describe your complaint in detail"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            style={{ ...styles.input, minHeight: '150px' }}
          />
          <button
            type="submit"
            style={styles.button}
            disabled={isSaving}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
          >
            {isSaving ? 'Submitting...' : 'Submit Complaint'}
          </button>

          {error && <div style={{ ...styles.message, ...styles.error }}>{error}</div>}
          {success && <div style={{ ...styles.message, ...styles.success }}>{success}</div>}
        </form>
      </section>

      <section style={styles.section}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.input}
            disabled={isLoading}
          />
          <button
            onClick={fetchComplaints}
            disabled={isLoading}
            style={styles.button}
          >
            Refresh
          </button>
        </div>

        <h2 style={{ color: colors.text }}>Recent Complaints</h2>

        {isLoading ? (
          <div style={{ color: colors.textSecondary }}>Loading complaints...</div>
        ) : error ? (
          <div>
            <p style={{ color: colors.error }}>{error}</p>
            <button onClick={fetchComplaints} style={styles.button}>
              Retry
            </button>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <p style={{ color: colors.textSecondary }}>
            No complaints found{searchTerm ? ` matching "${searchTerm}"` : ''}
          </p>
        ) : (
          <div style={styles.grid}>
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.Id}
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = styles.cardHover.transform;
                  e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: colors.text }}>{complaint.Title}</h3>
                  <span style={{ fontSize: '0.8rem', color: colors.textSecondary }}>#{complaint.Id}</span>
                </div>
                <p style={styles.bodyClamp}>{complaint.Body}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={styles.status(complaint.Status)}>
                    {complaint.Status || 'Pending'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: colors.textSecondary }}>
                    {formatDate(complaint.CreatedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
