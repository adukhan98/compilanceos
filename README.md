# ComplianceOS - Lightweight Compliance Workspace

A modern, lightweight workspace designed to simplify compliance tasks, questionnaire management, and evidence collection for SOC 2, ISO 27001, and other frameworks.

## 🚀 Overview

ComplianceOS is built for teams that need a streamlined way to manage security questionnaires and compliance obligations without the bloat of enterprise tools. It helps you keep track of customers, manage security questionnaires, maintain a library of standard answers, and stay on top of upcoming compliance deadlines.

## ✨ Key Features

- **📊 Dashboard**: Get a bird's-eye view of your compliance status, upcoming deadlines, active questionnaires, and pending tasks.
- **🏢 Customer Management**: Organize questionnaires, agreements, and details by customer. Keep all your client-related compliance data in one place.
- **📝 Questionnaire Management**: 
  - Track progress of ongoing questionnaires.
  - Granular status updates for individual questions (Not Started, In Progress, Done).
  - Assign owners and due dates to specific questions.
- **📚 Smart Answer Library**: 
  - Automatically save your best answers to a reusable library.
  - "Smart Suggest" feature recommends answers based on keywords as you fill out new questionnaires.
  - Adopt suggested answers with a single click.
- **⏳ Timeline & Obligations**: Visual timeline of all your compliance obligations (renewals, audits, pen tests) to ensure you never miss a deadline.

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Vanilla CSS with modern features (CSS Variables, Flexbox/Grid) + Tailwind-like utility classes
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API + useReducer

## 🚦 Getting Started

Follow these steps to set up the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/adukhan98/compilanceos.git
    cd compilanceos
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the app:**
    Visit `http://localhost:3000` (or `http://localhost:5173` if port 3000 is taken).

## 💡 Workflow Guide

### 1. Adding a Customer
Start by adding the customers you are working with.
- Go to the **Customers** page.
- Click "Add Customer".
- Enter the customer details (Name, Industry, etc.).

### 2. Managing Questionnaires
When a customer sends a security questionnaire:
- Navigate to the **Customer Detail** page for that specific customer.
- Click "Add Questionnaire".
- Create the questionnaire and add the questions manually (bulk import coming soon!).
- You can track the status of the entire questionnaire and each individual question.

### 3. Answering Questions
- Open a **Questionnaire Detail** page.
- Expand a question to answer it.
- **Smart Suggestions**: If you've answered similar questions before, the **Answer Library** will automatically suggest the best match. Click "Use This" to instantly fill the answer.
- **Saving to Library**: When you mark a question as "Final" and "Done", you can save it to the Answer Library to reuse it in the future.

### 4. Tracking Deadlines
- Use the **Timeline** page to view all your compliance obligations (e.g., "SOC 2 Renewal", "Pen Test Due").
- The **Dashboard** highlights items that are due soon or overdue, so you can prioritize your work.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
