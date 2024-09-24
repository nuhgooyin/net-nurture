# ![Net Nurture Logo](https://github.com/nuhgooyin/net-nurture/blob/main/frontend/public/favicon.png) Net Nurture: Your Personal CRM Solution

## Overview

Net Nurture is a user-friendly personal CRM (Customer Relationship Management) solution designed to help individuals expand and maintain their network of contacts efficiently. This single-page web application integrates with users' email accounts to track and manage networking contacts automatically. 

Hence, reducing the cognitive load of having to:
1. Remember to catch up with contacts within a specified amount of time.
2. Having to recall what your previous conversion with them was all about.
3. Finding contacts and their corresponding information when you're in a rush.

See the key features below to see how these problems are solved!

![Net Nurture Homepage](https://github.com/nuhgooyin/net-nurture/blob/main/images/index.png)
*Figure 1: Net Nurture homepage showcasing the application's user-friendly interface*

## Key Features

1. **User Authentication**: Secure signup and signin functionality.
2. **Dashboard**: Displays contact information including name, communication method, conversation summaries, tags, and last contact date.
3. **Email Integration**: Automatically populates and maintains the dashboard in real-time by linking with Gmail.
4. **Manual Contact Management**: Users can add, edit, and override contact information.
5. **Search and Filter**: Find specific contacts by name or filter by tags.
6. **Conversation Summarization**: Utilizes open-source LLM APIs to summarize conversations with contacts automatically.
7. **Automated Emails**: Schedule and send pre-written emails to contacts after a specified period.

## Screenshots

### Dashboard
![Dashboard](https://github.com/nuhgooyin/net-nurture/blob/main/images/dashboard_view.png)
*Figure 2: Net Nurture dashboard displaying contact information and automatically prefilled & updated conversation summaries*

### Email Fetch Configuration
![Email Fetch Configuration](https://github.com/nuhgooyin/net-nurture/blob/main/images/email_fetch_options.png)
*Figure 3: Email fetch configuration panel for customizing email retrieval settings*

### Email Scheduling
![Email Scheduling](https://github.com/nuhgooyin/net-nurture/blob/main/images/email_scheduler.png)
*Figure 4: Email scheduling interface for automated follow-ups or catchup emails*

### Sidebar
![Sidebar](https://github.com/nuhgooyin/net-nurture/blob/main/images/sidebar.png)
*Figure 5: Sidebar navigation menu providing quick access to key features*

## Demo Video

[Watch the Net Nurture Demo](https://youtu.be/xgxkfDzWKGQ)

## Target Audience

- Job hunters
- Professors
- Sponsorship Directors
- Entrepreneurs
- Project Leads

## User Scenario/UX Walkthrough: Job Hunter

1. A CS student looking for internships creates an account on Net Nurture.
2. They link their Gmail account to import contacts.
3. The dashboard populates with contacts, showing names, last contact dates, communication methods, and conversation summaries.
4. Notifications remind the user to catch up with contacts they haven't interacted with in over 3 months (by default).

## Technologies Used

Net Nurture leverages a modern tech stack (PEAN) to deliver a robust and efficient personal CRM solution:

### Frontend
- **Angular**: A framework for building web applications
- **TypeScript**: Adds static typing to JavaScript for improved development experience
- **HTML5 & CSS3**: For structuring and styling the user interface

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web application framework for Node.js, handling HTTP requests and routing

### Database
- **PostgreSQL**: Open-source relational database for storing user and contact information

### Authentication
- **OAuth**: For secure Gmail integration and user authentication

### AI Integration
- **Gemini AI**: Used for generating conversation summaries

### DevOps & Deployment
- **Docker**: Containerization of the application for consistent development and deployment
- **GitHub Actions**: CI/CD pipeline for automated testing and deployment
- **Google Cloud Platform (GCP)**: Cloud infrastructure for hosting the application
- **NGINX Reverse Proxy**: An intermediary layer between client requests and backend services.

### APIs
- **Gmail API**: For fetching and managing email threads
- **Gmail Webhooks**: For updating dashboard on new emails sent and received.

### Version Control
- **Git**: Distributed version control system
- **GitHub**: Hosting the project repository and managing collaborative development
