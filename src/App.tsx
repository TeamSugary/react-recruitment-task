import { useState, useEffect, JSX } from 'react';
import ComplaintsForm from './components/complaints-form';
import CardSkeleton from './components/card-skeleton';
import ComplaintCard from './components/complaint-card';
import { ClipboardX, TriangleAlert } from 'lucide-react';

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
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Complaints List</h2>

      <div className='md:columns-2 lg:columns-3 xl:columns-4 *:break-inside-avoid space-y-4 mt-5'>
        {/* complaints form */}
        <ComplaintsForm refetchComplaints={fetchComplaints} />

        {/* Error state */}
        {error && (
          <div className="card bg-red-500/20 !border-red-500 text-center">
            <TriangleAlert className='mx-auto text-red-500 opacity-85' size={50} />
            <p className='text-red-500 font-semibold'>
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
              <div className="card bg-yellow-500/20 !border-yellow-500 text-center">
                <ClipboardX className='mx-auto text-yellow-500 opacity-85' size={50} />
                <p className='text-yellow-500 font-semibold'>
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