'use client';

import { useState, useEffect } from 'react';
import './App.css';

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
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch complaints from the API
  const fetchComplains = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}${listPath}`);
      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }
      const data = await response.json();
      setComplains(data);
    } catch (e) {
      setErrorMessage(`Error loading complaints: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Save a new complaint
  const handleSubmit = async () => {
    if (!title.trim()) {
      setErrorMessage('Please enter a title for your complaint');
      return;
    }

    if (!body.trim()) {
      setErrorMessage('Please enter a description for your complaint');
      return;
    }
    try {
      setIsSaving(true);
      setErrorMessage('');
      setSuccessMessage('');

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

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (!data.Success) throw new Error('Failed to save complaint.');
      setSuccessMessage('Complaint submitted successfully!');
      setTitle('');
      setBody('');
      // Refresh complaints list
      fetchComplains();
    } catch (e) {
      setErrorMessage(`Failed to submit complaint: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };
  //Skeleton Loading
  const SkeletonLoading = () => {
    return (
      <div className='complaints-list'>
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className='complaint-item skeleton'>
            <div className='complaint-accent'></div>
            <div className='complaint-content'>
              <div className='complaint-header'>
                <div className='skeleton-title'></div>
                <div className='skeleton-id'></div>
              </div>
              <div className='skeleton-body'></div>
              <div className='complaint-footer'>
                <div className='skeleton-date'></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    fetchComplains();
    return () => {
      // Cleanup function
    };
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className='app-container'>
      <header className='app-header'>
        <h1>
          <span className='title-highlight'>Complaint</span> Management System
        </h1>
      </header>
      <main className='main-content'>
        <div className='column form-column'>
          <div className='panel'>
            <div className='panel-header'>
              <h2>Submit a Complaint</h2>
            </div>

            <div className='form-container'>
              <div className='form-group'>
                <label htmlFor='title'>Title</label>
                <div className='input-wrapper'>
                  <input
                    id='title'
                    type='text'
                    placeholder='Enter complaint title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className='form-group'>
                <label htmlFor='description'>Description</label>
                <div className='input-wrapper'>
                  <textarea
                    id='description'
                    placeholder='Describe your complaint in detail'
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={7}
                    cols={70}
                    disabled={isSaving}></textarea>
                </div>
              </div>

              {errorMessage && (
                <div className='message error'>
                  <svg viewBox='0 0 24 24' width='20' height='20' fill='none' stroke='currentColor' strokeWidth='2'>
                    <circle cx='12' cy='12' r='10'></circle>
                    <line x1='12' y1='8' x2='12' y2='12'></line>
                    <line x1='12' y1='16' x2='12' y2='16'></line>
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className='message success'>
                  <svg viewBox='0 0 24 24' width='20' height='20' fill='none' stroke='currentColor' strokeWidth='2'>
                    <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path>
                    <polyline points='22 4 12 14.01 9 11.01'></polyline>
                  </svg>
                  <span>{successMessage}</span>
                </div>
              )}

              <button className='submit-button' onClick={handleSubmit} disabled={isSaving}>
                {isSaving ? (
                  <div className='button-content'>
                    <div className='loader'></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <span>Submit Complaint</span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className='column list-column'>
          <div className='panel'>
            <div className='panel-header'>
              <h2>Complaints List</h2>
              <svg
                viewBox='0 0 24 24'
                className={isLoading ? 'refresh-svg spinning' : 'refresh-svg'}
                onClick={fetchComplains}>
                <path d='M23 4v6h-6'></path>
                <path d='M1 20v-6h6'></path>
                <path d='M3.51 9a9 9 0 0 1 14.85-3.36L23 10'></path>
                <path d='M20.49 15a9 9 0 0 1-14.85 3.36L1 14'></path>
              </svg>
            </div>

            <div className='complaints-container'>
              {isLoading ? (
                <SkeletonLoading />
              ) : complains && complains.length > 0 ? (
                <div className='complaints-list'>
                  {complains.map((complain) => (
                    <div key={complain.Id} className='complaint-item'>
                      <div className='complaint-accent'></div>
                      <div className='complaint-content'>
                        <div className='complaint-header'>
                          <h3>{complain.Title}</h3>
                          <span className='complaint-id'>ID: {complain.Id}</span>
                        </div>
                        <p className='complaint-body'>{complain.Body}</p>
                        <div className='complaint-footer'>
                          <span className='complaint-date'>
                            {formatDate(complain.CreatedAt) || 'No date available'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='empty-state'>
                  <div className='empty-illustration'>
                    <svg viewBox='0 0 24 24' width='64' height='64' fill='none' stroke='currentColor' strokeWidth='1'>
                      <path d='M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z'></path>
                      <polyline points='13 2 13 9 20 9'></polyline>
                    </svg>
                  </div>
                  <h3>No complaints yet</h3>
                  <p>Submit a complaint to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
