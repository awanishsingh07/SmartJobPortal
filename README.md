🧠 Smart Hire - Job Portal
Smart Hire is an intelligent job portal that simplifies and automates the hiring process for companies. 
It features role-based access, AI-powered resume screening, ban logic for unqualified applicants, 
email notifications, and HR analytics, built with React.js, Spring Boot, and MySQL.

🚀 Features
👤 Role-Based Access
HR and Applicant users with separate dashboards
JWT-based secure login and registration

📢 HR Capabilities
Post job listings
Receive matched resumes via email
View analytics (total/matched/rejected applicants)
Create virtual interview rooms

👨‍💼 Applicant Features
Browse and apply for jobs with resume upload
Resume matching against job description
Get email updates (selected/rejected)
Banned for 6 months on repeated mismatch

🧠 AI Resume Screening
Uses Apache Tika for parsing PDF resumes
Matches resume content to job requirements
Threshold-based selection (e.g., 70%)

📬 Email Notifications
Sends emails to HR for matched resumes
Notifies applicants on rejection or ban status

📊 Analytics Dashboard
HR can view charts showing applicant stats
Uses Chart.js for visual representation

💬 Interview Room Setup
HR can create unique interview rooms
Includes room name and participant limit

🛠 Tech Stack

Frontend
React.js
Tailwind CSS
Axios
React Router
Redux / Context API

Backend
Spring Boot
Spring Security (with JWT)
Spring Data JPA
Spring Mail
MySQL
Apache Tika
