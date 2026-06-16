# KitabGuru Frontend

The user-facing and admin web application for KitabGuru. Built with React, Vite, Tailwind CSS, and Radix UI primitives.

## Features

- **User Chat Interface**: Clean, responsive markdown-supported chat UI.
- **Admin Dashboard**: Manage users and view system logs.
- **Media Playback**: Embedded video and image players.
- **Responsive Design**: Mobile-first architecture using Tailwind CSS.

## Setup & Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables (if needed). The default `.env` might just point to the local backend:
   ```env
   VITE_API_BASE_URL=http://localhost:8001
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Production Deployment (Docker)

The project includes a `Dockerfile` and `nginx.conf` for optimized production deployments.

1. Build the Docker image:
   ```bash
   docker build -t kitabguru-frontend .
   ```

2. Run the container:
   ```bash
   docker run -p 80:80 kitabguru-frontend
   ```
   
The application will be available at `http://localhost:80`. Nginx will automatically serve the static built files and handle routing fallbacks for React Router.
