# Project Title and Team Name
**Team Name:** YorkRejects  
**Project Title:** Net Nurture

## Team Members
- **Dan Nguyen**: Full-Stack - [danduy.nguyen@mail.utoronto.ca](mailto:danduy.nguyen@mail.utoronto.ca)
- **Luowei Tan**: Full-Stack - [luowei.tan@mail.utoronto.ca](mailto:luowei.tan@mail.utoronto.ca)
- **Sanjay Mylanathan**: Full-Stack - [sanjay.mylanathan@mail.utoronto.ca](mailto:sanjay.mylanathan@mail.utoronto.ca)

## Brief Description of the Web Application
- **Overview**: Net Nurture is a single-page web application designed to help users efficiently expand and maintain their network of contacts.
- **Main Purpose**: Allow users to efficiently expand and maintain their network of contacts by tracking:
  - Contact name
  - Method of communication
  - Summary of the conversations with this contact
  - Tags
  - The date of the last conversation
  - This information is stored on the user’s dashboard, and reminders for when to check up on contacts are given through dashboard notifications.

- For a general overview of how this will look, see our UI mockup here: [Net Nurture UI Mockup](https://www.canva.com/design/DAGIalyau_o/krGdKIZq7czRcHZCDXJU_w/edit)

- **Key Features**:
  - The initial page is a user signup/sign-in page. At the end of the sign-up, we will also ask the user the preferred timeline of how recent the data they want to include in the summarized information for contacts are, along the lines of ‘All time’, ‘1 year’, and ‘3 months’.
  - After signing in or signing up, it will display the user dashboard that shows the information mentioned in the overview and allows access to “show notifications”.
  - Users can link their Gmail (if we have time, we may add the ability to link other social media), and the application will automatically fill out and maintain the user’s dashboard in real-time.
  - Users have the option to manually add contacts and can override contact information, method of communication, date of last contact, conversation summary, tags, etc.
  - Users are able to search for specific contacts by name.
  - Users are able to filter contacts by tags.
  - Using open-source LLM APIs, summarize the user’s conversations with each of their contacts, with new messages from contacts afterwards being received through webhook and input with the previously summarized conversations to create an updated summary.
  - Email sequencing: Allow users to set automated emails (i.e., user-pre-written emails sent to a specific contact after x number of days).


- **Target Audience**:
  - Job hunters
  - Professors
  - Sponsorship Directors
  - Entrepreneurs
  - Project Leads

- **User Scenarios**:
  - **Job Hunter**: Suppose a CS student is looking for internships or co-ops and starts reaching out to alumni of their University through a mentorship program, alongside hiring managers and potential mentors through email. After creating an account on Net Nurture and logging in, they get an empty contacts list on the dashboard. They can link their Gmail, and after doing so, the page displays a loading page before displaying all of their Gmail contacts who have had a conversation with them. Each contact will have a name, date of last contact, method of communication (email only for now) and a summary of recent conversations. For notification, if the date of last contact for some contact is more than 3 months, the user will be reminded to catch up with that contact.

## How to Fulfil "Required Elements"
To fulfill the essential requirements for our web application, we will use the PEAN stack (PostgreSQL, Express, Angular, NodeJS). This choice provides a comprehensive framework, covering both frontend and backend development.

- **Modern Frontend Framework**: We will use Angular as our frontend framework, ensuring a modern interface for users.
- **Single Page Application (SPA)**: Our frontend will be structured as a SPA, providing a seamless and interactive user experience.
- **Backend API**: We will build the backend using Express, paired with PostgreSQL as our database system for reliable data handling.
- **RESTful API**: We will follow RESTful principles to enhance the API’s functionality and maintainability.
- **Deployment**: Ensure the application is deployed on a Virtual Machine using Docker and Docker Compose, and made accessible via a public URL. All deployment files, including CI files for building images, will be committed to GitHub for transparency.
- **Accessibility**: The application will be accessible to the general public with no additional steps, requiring only the URL for access.
- **Third-Party API**: We plan to integrate Google’s Gmail API for accessing user Gmail data and may consider additional APIs like Outlook in the future. [Google’s Gmail API Guide](https://developers.google.com/gmail/api/guides)
- **OAuth 2.0**: OAuth 2.0 will be used for secure user authorization during signup and login processes.

## How to Fulfil "Additional Requirements"
To meet the additional requirements for our web application, we will implement features that enhance its functionality and user engagement through webhook interaction and long-running tasks.

- **Webhook Interaction**: We will implement a feature that interacts with a webhook to pull updates from an external service. Specifically, we will use the Gmail API’s server push notifications to watch for changes in Gmail mailboxes. This interaction via webhooks allows us to pull new emails from contacts and update the conversation summaries for those contacts automatically. [Learn more about Gmail API push notifications](https://developers.google.com/gmail/api/guides/push)
- **Long-Running Task**: We will implement functionality to handle long-running tasks efficiently. This will include:
  - Fetching Profile and Conversation Data: Initially, we will fetch profile and conversation data from linked applications, which can take more than 10 seconds.
  - Summarizing User Conversations: We will use a language model to generate summaries of user conversations. Utilizing the OpenAI Chat API, we can feed the conversation data and request summaries. Also, models from a hugging face like “DistilBERT” or similar can be employed for this task to provide concise conversation summaries.[Learn more about OpenAI Chat API](https://platform.openai.com/docs/api-reference/chat) [Learn more about hugging face DistilBERT](https://huggingface.co/docs/transformers/v4.41.3/en/model_doc/distilbert#overview)
  - Email Sequence: Allow users to set automated emails (i.e. user-pre-written emails that are sent to a specific contact after x number of days). We will utilize setTimeout() to send the emails at the specified time. The sending of the emails will be done through the Gmail API. Users could either use pre-written email from Net Nurture or write themself.


## Milestones
### Alpha Version
- **Date**: Jun 27, 2024, 4:00:00 PM
- **Goals**:
  - Basic UI completed, including dashboard, sign-in/account creation page, notifications pop-up (HTML, CSS)
  - User account creation (OAuth 2.0)
  - User login/signout.
  - Users can manually add contacts.
  - Users can manually edit contacts. (including their respective information)
  - Implement searching contacts by name.
  - Implement a filter to display only contacts with specific tags.

### Beta Version
- **Date**: Jul 11, 2024, 4:00:00 PM
- **Goals**:
  - Implement feedback from Alpha
  - Integrate third-party API from Google Gmail, to obtain all contact information
  - User can link their Gmail account
  - The initial fetch of profile data and conversation data from linked applications, such as Gmail (long-running task)
  - Interact with a webhook by Gmail to receive updates. (webhook)
  - Implement email sequencing which enable users to set automated emails (long-running task).
  - Reminders are given through dashboard notifications.


### Final Version
- **Date**: Jul 25, 2024, 4:00:00 PM
- **Goals**:
  - Implement feedback from Beta.
  - LLM integration to summarize conversations. (long-running task)
  - Ensure the application is deployed on a Virtual Machine using Docker and Docker Compose, and made accessible via a public URL.
