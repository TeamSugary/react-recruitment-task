# React JS Developer Recruitment Test

# 🗣️ SpeakUp – Complaint Submission App

A modern and responsive complaint submission application built with **React** and **TypeScript**, where users can submit their complaints and view a list of all submitted complaints. Designed with attention to **UI/UX**, **error handling**, and **mobile responsiveness** using raw CSS and animations.

## ✨ Features 

- 📝 Submit complaints with title and description
- 📄 View list of all submitted complaints
- 🔁 Live loading indicators during fetch/save
- 🌙 Dark and Light mode toggle
- 🧠 Animated visual with Framer Motion and Lottie
- ✅ Form validation and user feedback (SweetAlert2)
- 📱 Fully responsive design
- 🔗 API integration with error handling



## 🚀 Technologies Used

- React 18+
- TypeScript
- Framer Motion
- Lottie-react
- SweetAlert2
- Raw CSS (no external UI library)
- React Icons

## 🛠️ Getting Started

### 1. Clone the Repository

bash

```git clone https://github.com/Sanjida-Khanam778/react-recruitment-task.git```

cd react-recruitment-task

### 2. Install Dependencies
bash

```npm install```

### 3. Run Development Server
bash

```npm run dev```

Open http://localhost:5173 in your browser.


📦 API Endpoints
GET Complaints:
https://sugarytestapi.azurewebsites.net/TestApi/GetComplains

POST Complaint:
https://sugarytestapi.azurewebsites.net/TestApi/SaveComplain



🙋‍♀ About the Developer
Developed by Sanjida Khanam
Frontend Developer



**Note**: We specifically look for attention to detail in handling loading states, error scenarios, and creating intuitive user interactions. Avoid using any UI libraries - demonstrate raw CSS skills.

```Before:```

![image](https://github.com/user-attachments/assets/311c420f-eaf5-4a0e-a654-92cb389dde01)


```After:```

Light Mode:
![image](https://github.com/user-attachments/assets/9d0374f3-1526-4e8f-b852-5a6bc59c4bc7)



### Summary of Changes:
Fixed:

✅ API endpoint error corrected and fetching logic improved.

✅ Form validation: Prevented submission with empty title/body fields.

✅ State update issue resolved after complaint submission.

✅ Fixed TypeScript errors and added strong typing for better type safety.

Improved:

✅ Responsive layout for mobile and smaller devices.

✅ Form structure, spacing, and visual hierarchy using modern CSS.

✅ Loading states added for both API fetch and save actions.

Added:

✅ Dark Mode Toggle with state and class switching.

✅ SweetAlert2 integration for user-friendly success feedback.

✅ Framer Motion animation for visual enhancement (moved from “Improved” to “Added”).

✅ Spinner from react-icons during saving to indicate activity.

✅ Page title and favicon for better UX and branding.


