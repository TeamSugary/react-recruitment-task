# Pull Request - Changes to Complaints Handling

## Summary of Changes
- **Fixed**: Added proper error handling for fetching and saving complaints.
- **Improved**: Added input validation for the complaint title and body.
- **Added**: Updated the complaint submission process with proper error messaging and loading indicators.
- **Updated**: Applied TypeScript types to the state variables and API responses.
- **Fixed**: Added a call to refresh the complaint list after submitting a new complaint.

## Technical Decisions
- **Input Validation**: Ensured the title is at least 4 characters long and the body is at least 20 characters before allowing submission.
- **Error Handling**: Added error messages to guide users when fetching or saving complaints fails.
- **API Handling**: Adjusted API calls to include dynamic data from the form submission (Title and Body) and added the `await fetchComplains()` to refresh the list after a successful submission.

## Screenshots

**Before**:  
![Before Screenshot](https://i.ibb.co.com/xSG6Bncz/Screenshot-19.png)

**After**:  
![After Screenshot](https://i.ibb.co.com/2JKxnM8/Fire-Shot-Capture-051-Complainer-home-localhost.png)
