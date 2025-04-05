import { useState, useEffect, FormEvent } from 'react';
import './App.css';

interface Complaint {
	Id: number;
	Title: string;
	Body: string;
	CreatedAt: string;
}

interface APIResponse {
	Success: boolean;
	Message?: string;
}

const baseUrl = 'https://sugarytestapi.azurewebsites.net/';
const listPath = 'TestApi/GetComplains';
const savePath = 'TestApi/SaveComplain';

function App() {
	const [complains, setComplains] = useState<Complaint[]>([]);
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	// Fetch complaints from the API
	const fetchComplains = async () => {
		setIsLoading(true);
		setErrorMessage('');
		try {
			const response = await fetch(`${baseUrl}${listPath}`);
			if (!response.ok) {
				throw new Error(`Failed to fetch complaints: ${response.status}`);
			}
			const data = await response.json();
			setComplains(data);
		} catch (error) {
			console.log('Error fetching complaints', error);
			setErrorMessage('Failed to load complaints. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	// Save a new complaint
	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		// Form Validation
		if (!title.trim() || !body.trim()) {
			setErrorMessage('Please add both title and body');
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
				throw new Error(`Server error: ${response.status}`);
			}

			const data: APIResponse = await response.json();
			console.log(data);
			if (!data.Success) {
				throw new Error(data.Message || 'Failed to save complaint');
			}

			setTitle('');
			setBody('');
			setSuccessMessage('Complaint subitted successfully!');

			// refetch complaints
			fetchComplains();

			// Auto-hide success message after 5 seconds
			setTimeout(() => {
				setSuccessMessage('');
			}, 5000);
		} catch (error) {
			console.error('Error saving complaint:', error);
			setErrorMessage(error instanceof Error ? error.message : 'Failed to submit complaint. Please try again');
		} finally {
			setIsSaving(false);
		}
	};

	// Format date function to make the date more readable
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}).format(date);
	};
	useEffect(() => {
		fetchComplains();
	}, []); // Empty dependency array to run this on mount and no cleanup required

	return (
		<div className='container'>
			<header className='header'>
				<h1>Complaint Management System</h1>
			</header>

			<main className='main-content'>
				<section className='form-section'>
					<h2>Submit a Complaint</h2>

					<form className='complaint-form' onSubmit={handleSubmit}>
						<div className='form-group'>
							<label htmlFor='title'>Title</label>
							<input
								type='text'
								id='title'
								placeholder='Enter complaint title'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								disabled={isSaving}
								required
							/>
						</div>

						<div className='form-group'>
							<label htmlFor='body'>Description</label>
							<textarea
								id='body'
								placeholder='Describe your complaint in detail'
								value={body}
								onChange={(e) => setBody(e.target.value)}
								rows={4}
								disabled={isSaving}
								required
							/>
						</div>

						<button type='submit' className={`submit-button ${isSaving ? 'loading' : ''}`} disabled={isSaving}>
							{isSaving ? (
								<>
									<span className='spinner'></span>
									<span>Submitting...</span>
								</>
							) : (
								'Submit Complaint'
							)}
						</button>
					</form>

					{errorMessage && (
						<div className='message error-message' role='alert'>
							{errorMessage}
						</div>
					)}

					{successMessage && (
						<div className='message success-message' role='status'>
							{successMessage}
						</div>
					)}
				</section>

				<section className='complaints-section'>
					<div className='section-header'>
						<h2>Complaints List</h2>
						<button
							onClick={fetchComplains}
							className='refresh-button'
							disabled={isLoading}
							aria-label='Refresh complaints list'>
							↻
						</button>
					</div>

					{isLoading ? (
						<div className='loading-container'>
							<div className='loader'></div>
							<p>Loading complaints...</p>
						</div>
					) : complains.length > 0 ? (
						<div className='complaints-list'>
							{complains.map((complaint) => (
								<div key={complaint.Id} className='complaint-card'>
									<div className='complaint-header'>
										<h3>{complaint.Title}</h3>
										<span className='complaint-id'>ID: {complaint.Id}</span>
									</div>
									<p className='complaint-body'>{complaint.Body}</p>
									<div className='complaint-footer'>
										<time dateTime={complaint.CreatedAt}>{formatDate(complaint.CreatedAt)}</time>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className='empty-state'>
							<p>No complaints available.</p>
							<p className='empty-state-subtext'>Be the first to submit a complaint!</p>
						</div>
					)}
				</section>
			</main>

			<footer className='footer'>
				<p>&copy; {new Date().getFullYear()} Complaint Management System</p>
			</footer>
		</div>
	);
}

export default App;
