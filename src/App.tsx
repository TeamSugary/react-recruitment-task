import { useState, useEffect } from 'react';
import ComplaintsForm from './components/complaints-form';
import CardSkeleton from './components/card-skeleton';
import ComplaintCard from './components/complaint-card';

interface Complaint {
  Id: number;
  Title: string;
  Body: string;
  CreatedAt: string;
}

interface ApiResponse<T = Complaint[]> {
  Data: T;
  Message: string | null;
  ReturnCode: number;
  Success: boolean;
}

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";

function App() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const data: ApiResponse = await response.json();
      // setComplaints(data);
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
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Complaints List</h2>

      <div className='md:columns-2 lg:columns-3 xl:columns-4 *:break-inside-avoid space-y-4 mt-5'>
        {/* complaints form */}
        <ComplaintsForm refetchComplaint={fetchComplaints} />

        {/* Error state */}
        {error && (
          <div className="card bg-red-500/20 !border-red-500">
            Error: {error}
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
              <div className="card bg-yellow-500/20 !border-yellow-500">
                No complaints found
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;