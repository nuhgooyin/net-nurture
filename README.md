# Project Title and Team Name
**Team Name:** YorkRejects  
**Project Title:** Net Nurture

## Team Members
- **Dan Nguyen**: Full-Stack - [danduy.nguyen@mail.utoronto.ca](mailto:danduy.nguyen@mail.utoronto.ca)
- **Luowei Tan**: Full-Stack - [luowei.tan@mail.utoronto.ca](mailto:luowei.tan@mail.utoronto.ca)
- **Sanjay Mylanathan**: Full-Stack - [sanjay.mylanathan@mail.utoronto.ca](mailto:sanjay.mylanathan@mail.utoronto.ca)

## Brief Description of the Web Application
- **Overview**: Net Nurture is a single-page web application designed to help users efficiently expand and maintain their network of contacts. It integrates with various interpersonal communication accounts to track and manage networking contacts.
- **Key Features**:
  - User dashboard with access to contacts, notifications, and settings pages.
  - Integration with social media (Email, LinkedIn, Discord, Instagram) to auto-fill and maintain the dashboard in real-time.
  - Google Calendar integration for notifications and event planning.
  - Manual contact management with options to override contact details.
  - Summarization of last conversations using open-source LLM APIs.
- **Target Audience**:
  - Job hunters
  - Professors
  - Sponsorship Directors
  - Entrepreneurs
  - Project Leads
- **User Scenarios**:
  - **Job Hunter**: A CS student looking for internships or co-ops can use Net Nurture to manage contacts made through email (Gmail or Outlook). After linking their email accounts, the student's dashboard will display all email contacts with details such as name, date of last contact, summary of last conversation, and method of communication. If a contact hasn't been communicated with in over three months, the student will receive a reminder to catch up.

## How to Fulfil "Required Elements"
- **Modern Frontend Framework**: We’ll use Angular as our modern frontend framework.
- **Single Page Application (SPA)**: We’ll ensure it is.
- **Backend API**: We shall use Express as the core backend API.
- **RESTful API**: We will review the RESTful principles and apply them where appropriate.
- **Deployment**: Ensure the application is deployed on a Virtual Machine using Docker and Docker Compose, and made accessible via a public URL.
- **Accessibility**: The public can use our application without extra steps. The only knowledge required is the URL link, no need to contact us.
- **Third-Party API**: Interact with Google’s Gmail API for “authorized access to a user's Gmail data” with potential further integration with other APIs such as Outlook.
- **OAuth 2.0**: OAuth 2.0 will be used for user signup/login authorization-related purposes.

## How to Fulfil "Additional Requirements"
- **Webhook Interaction**: Interact with a webhook by Gmail to receive updates.
- **Real-Time Functionality**: Real-time reminders given through dashboard notifications and optional calendar notifications.
- **Long-Running Task**:
  - The initial fetch of profile data and conversation data from linked applications.
  - The task of the LLM in summarizing the user’s conversations with contacts.

## Milestones
### Alpha Version
- **Date**: Jun 27, 2024, 4:00:00 PM
- **Goals**:
  - Basic UI completed, including dashboard, sign-in/account creation page, notifications pop-up (HTML, CSS).
  - User account creation (OAuth 2.0).
  - User login/signout.
  - Users can manually add contacts.
  - Users can manually edit contacts (including their respective information).

### Beta Version
- **Date**: Jul 11, 2024, 4:00:00 PM
- **Goals**:
  - Implement feedback from Alpha.
  - Integrate third-party API from Google, to obtain all contact information.
  - The initial fetch of profile data and conversation data from linked applications, such as Gmail (should be a long-running task).
  - User can link their Gmail account.
  - Real-time reminders are given through dashboard notifications and optional calendar notifications (real-time functionality).

### Final Version
- **Date**: Jul 25, 2024, 4:00:00 PM
- **Goals**:
  - Implement feedback from Beta.
  - Complete as needed to fulfill the Additional Requirements.
  - LLM integration to summarize conversations (if the fetch is not already a long-running task).
  - Interact with a webhook by Gmail to receive updates (webhook).
  - Ensure the application is deployed on a Virtual Machine using Docker and Docker Compose, and made accessible via a public URL.
