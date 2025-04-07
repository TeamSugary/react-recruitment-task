import { useState, useEffect, JSX } from 'react';
import ComplaintsForm from './components/complaints-form';
import CardSkeleton from './components/card-skeleton';
import ComplaintCard from './components/complaint-card';
import { ClipboardX, TriangleAlert } from 'lucide-react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useTheme } from './providers/theme-provider';

interface Complaint {
  Id: number;
  Title: string;
  Body: string;
  CreatedAt: string;
}

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";

function App(): JSX.Element {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme()

  // Fetch complaints from the API
  const fetchComplaints = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${baseUrl}${listPath}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setComplaints(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="app-wrapper">
      <div className='app-header'>
        <h2 className='app-title'>Add and view <span> complaints</span></h2>
        {/* theme toggler */}
        <DarkModeSwitch onChange={toggleTheme} checked={theme === 'light'} moonColor='#94A3B8' sunColor='#FDB813' />
      </div>
      {/* all cards */}
      <div className='form-and-complaints-container'>
        {/* complaints form */}
        <ComplaintsForm refetchComplaints={fetchComplaints} />

        {/* Error state */}
        {error && (
          <div className="card card-error">
            <TriangleAlert size={50} />
            <p>
              Error: {error}
            </p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && <CardSkeleton count={23} />}

        {/* Success state */}
        {!isLoading && !error && (
          <>
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.Id}
                  complaint={complaint}
                />
              ))
            ) : (
              <div className="card card-no-data">
                <ClipboardX size={50} />
                <p>
                  No complaints found.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;