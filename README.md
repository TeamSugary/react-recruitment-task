# Complaint Management System

## Description

This is a complaint management system built with React that allows users to submit complaints, view a list of complaints, and manage them. The system uses a dark theme with a user-friendly interface to enhance the experience. It supports search functionality and feedback messages (success, error).

>**Note**: I couldn't design a more modern UI because your `index.css` file has incorrect styles, and per your task rules, only `App.tsx` was editable. This prevents the layout from using full width correctly.


---

## Features

- **Submit Complaints**: Users can fill out a form to submit a new complaint with a title and description.
- **View Complaints**: Users can view a list of submitted complaints.
- **Search Complaints**: Users can search complaints by title or body.
- **Status Indicator**: Each complaint shows its current status (Pending, In Progress, or Resolved).
- **Dark Theme**: A modern and visually appealing dark theme is used.
- **Error Handling**: Clear error and success messages are displayed based on the user actions.
- **Complaint Refresh**: Refresh the list of complaints with a simple button click.
- **Complaint Date**: Show complaint date.

---

## Issues Solved

1. **Error Handling**:  
   - **Before**: No error handling when fetching complaints or saving complaints.  
   - **Solved**: Proper error handling has been added to handle failed fetches or saves and to display a relevant error message to the user.

2. **Form Validation**:  
   - **Before**: No validation on the complaint form, allowing users to submit empty forms.  
   - **Solved**: Form validation was added to ensure that both the title and body of the complaint are filled out before submission. 

3. **Date Formatting**:  
   - **Before**: Complaints displayed without a proper date format.  
   - **Solved**: The date is now formatted into a more readable form (e.g., "Apr 7, 2025") based on the complaint creation date.

4. **Search Functionality**:  
   - **Before**: No functionality to filter or search complaints.  
   - **Solved**: A search bar has been added to filter complaints by their title or body.

5. **Success and Error Feedback**:  
   - **Before**: No feedback when a complaint is successfully submitted or if an error occurs.  
   - **Solved**: Success and error messages have been added, with styling for both cases to inform the user of the submission status.

6. **API Integration**:  
   - **Before**: The fetch request for complaints didn't handle errors properly.  
   - **Solved**: Added error handling to the fetch complaints function to properly manage failed API requests.

7. **Loading States**:  
   - **Before**: Loading state wasn't properly handled for fetching complaints.  
   - **Solved**: A loading indicator is now displayed while complaints are being fetched.

8. **State Management**:  
   - **Before**: State variables were not strongly typed.  
   - **Solved**: Types have been introduced for better state management and to ensure type safety in the React app.

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/complaint-management-system.git


npm install


npm run dev

