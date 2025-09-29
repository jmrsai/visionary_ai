# Visionary: Your Personal Vision Care App

Visionary is a comprehensive web application designed to empower users to take control of their eye health. It combines cutting-edge AI technology with a suite of diagnostic tests, guided exercises, and personalized tracking tools to provide a holistic approach to vision care.

## Key Features

-   **Comprehensive Eye Health Check-up:** A guided 5-minute suite of five core tests (Visual Acuity, Macular Health, Color Vision, Peripheral Vision, Accommodation) to provide a monthly snapshot of your vision health.
-   **AI-Powered Insights & Tools:**
    -   **AI Chatbot:** An interactive assistant to answer questions about eye health, symptoms, and medication schedules.
    -   **AI Symptom Checker:** Analyzes user-reported symptoms to provide a list of possible eye conditions.
    -   **AI Personalized Workouts:** Generates custom eye exercise routines based on individual needs and goals.
    -   **AI Holistic Health Insights:** Correlates lifestyle data (like screen time) with reported symptoms to provide actionable advice.
    -   **AI Form Coach:** Provides real-time feedback during exercises using your device's camera.
-   **Extensive Test Suite:** A wide range of individual diagnostic tests to screen for various conditions, including:
    -   Visual Acuity (Snellen Chart)
    -   Color Vision (Ishihara, HRR, D-15)
    -   Macular Health (Amsler Grid)
    -   Astigmatism, Contrast Sensitivity, and more.
-   **Eye Gym:** A dedicated section with guided individual exercises and structured workout circuits designed to reduce eye strain and improve focus.
-   **Progress Tracking & Reminders:**
    -   Track your Vision Score and progress over time.
    -   Log medication adherence and view your history.
    -   Set customizable reminders for medications, exercises, and appointments.
-   **Progressive Web App (PWA):** Installable on iOS, Android, Windows, and macOS for a native app-like experience directly from the browser.
-   **Light & Dark Mode:** A beautifully designed interface that adapts to your preferred theme.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (React)
-   **Generative AI:** [Google's Gemini models via Genkit](https://firebase.google.com/docs/genkit)
-   **UI:** [ShadCN UI](https://ui.shadcn.com/) & [Tailwind CSS](https://tailwindcss.com/)
-   **Deployment:** [Firebase App Hosting](https://firebase.google.com/docs/hosting)

## Getting Started

To run the project locally:

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Run the development server:**
    ```bash
    npm run dev
    ```
3.  **Run the Genkit development server (in a separate terminal):**
    ```bash
    npm run genkit:watch
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
