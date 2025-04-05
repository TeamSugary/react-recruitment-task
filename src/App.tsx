import { useState, useEffect } from 'react';

const baseUrl = 'https://sugarytestapi.azurewebsites.net/';
const listPath = 'TestApi/GetComplains';
const savePath = 'TestApi/SaveComplain';

function App() {
  const [complains, setComplains] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchComplains = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      const data = await response.json();
      setComplains(data);
    } catch (e) {
      setErrorMessage(`Error loading complaints: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(complains);
  // Save a new complaint
  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      setErrorMessage(''); // Clear any previous error messages
      const response = await fetch(`${baseUrl}${savePath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Title: title,
          Body: body,
        }),
      });
      const data = await response.json();
      if (!data.Success) throw new Error('Failed to save complaint.');

      // Reset form fields after successful submission
      setTitle('');
      setBody('');
      // Update complaints list after successful submission
      fetchComplains();
    } catch (e) {
      // Error state now being set
      setErrorMessage(`Failed to submit complaint: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  useEffect(() => {
    fetchComplains();
    // Added cleanup function
    return () => {};
  }, []);

  return (
    <div className='wrapper'>
      <h2>Submit a Complaint</h2>
      <div className='complain-form'>
        <input type='text' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder='Enter your complaint' value={body} onChange={(e) => setBody(e.target.value)} />
        <button onClick={handleSubmit}>{isSaving ? 'Submitting...' : 'Submit Complaint'}</button>
        {errorMessage && <div className='error-message'>{errorMessage}</div>}
      </div>

      <h2>Complaints List</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : complains.length ? (
        complains.map((complain) => (
          <div key={complain.Id} className='complain-item'>
            <h3>{complain.Title}</h3>
            <p>{complain.Body}</p>
          </div>
        ))
      ) : (
        <p>No complaints available.</p>
      )}
    </div>
  );
}

export default App;
