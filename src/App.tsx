import { useState, useEffect } from 'react';
import ComplaintsForm from './components/complaints-form';

const baseUrl = "https://sugarytestapi.azurewebsites.net/";
const listPath = "TestApi/GetComplains";

function App() {
  const [complains, setComplains] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch complaints from the API
  const fetchComplains = async () => {
    setIsLoading(true);
    const response = await fetch(`${baseUrl}${listPath}`);
    const data = await response.json();
    setComplains(data);
    setIsLoading(false);
  };


  useEffect(() => {
    fetchComplains();
  }, []); // Missing dependency array cleanup

  return (
    <div className="p-5">
      <h2>Complaints List</h2>

      <div className='md:columns-2 lg:columns-3 xl:columns-4 *:break-inside-avoid  space-y-4 mt-5'>
        {/* complaints form */}
        <ComplaintsForm />

        {/* All complaints preview */}
        {isLoading ? (
          <div>Loading...</div>
        ) : complains.length ? (
          complains.map((complain) => (
            <div key={complain.Id} className='card'>
              <h3 className='text-lg font-semibold'>{complain.Title}</h3>
              <p className='text-body-text/85'>{complain.Body}</p>
            </div>
          ))
        ) : (
          <div className='card'>No complaints available.</div>
        )}
      </div>

    </div>
  );
}

export default App;