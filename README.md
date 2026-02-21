# W40K SV Ranking Dashboard - Frontend

This is a modern, responsive web interface built to display Warhammer 40k ranking data. It consumes a custom API and renders the data using a "Grimdark" aesthetic inspired by the W40K universe.

## Technologies
* **Vue.js 3**: Using the Composition API (`script setup`).
* **Tailwind CSS v4**: The latest version for ultra-fast styling and modern CSS features.
* **Vite**: Next-generation frontend tooling for a fast development experience.
* **Lucide Vue Next**: (Optional) For sleek, consistent iconography.

## Features
* **Real-time Data Fetching**: Connects directly to a FastAPI backend.
* **Responsive Design**: Optimized for both desktop and mobile viewing.
* **Warhammer Aesthetic**: Custom dark theme with high-contrast accents (Orange/Slate).
* **Automatic Updates**: Reflects changes made in the source Google Sheet instantly.

## Setup & Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend

2. **Install Dependencies:**

Bash
npm install

3. **Configure the API URL:**

Ensure your backend is running at http://127.0.0.1:8000.

Check src/App.vue to ensure the fetch URL matches your local or production backend.

**Development**
To start the development server with Hot Module Replacement (HMR):

Bash
npm run dev
The app will be available at: http://localhost:5173

**Build for Production**
To create an optimized production build:

Bash
npm run build

**Styling**
This project uses Tailwind CSS v4. Configuration is handled via the @tailwindcss/vite plugin in vite.config.js and directives in src/assets/main.css.