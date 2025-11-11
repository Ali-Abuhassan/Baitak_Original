# Backend Server Setup

## Issue
The frontend is currently showing "Backend services are temporarily unavailable" because the backend API server is not running.

## Solution
To fix this issue, you need to start the backend server. Here are the steps:

### Option 1: If you have a backend repository
1. Navigate to your backend project directory
2. Install dependencies: `npm install` or `yarn install`
3. Start the server: `npm start` or `yarn start`
4. The backend should typically run on port 3000 or 8000

### Option 2: If you need to create a backend
The frontend expects a backend API with the following endpoints:
- `GET /api/search` - Smart search endpoint
- `GET /api/search/suggest` - Search suggestions endpoint
- `GET /services` - Services listing endpoint
- `GET /categories` - Categories endpoint

### Option 3: Update API URL
If your backend is running on a different URL, update the environment variables:
1. Update `.env.local` file with the correct `VITE_API_URL`
2. Restart the frontend development server

## Current Status
- Frontend: Running on http://localhost:3026
- Backend: Not running (causing the error)
- Demo Mode: Active (showing sample data)

## Demo Mode
The frontend now includes a demo mode that shows sample services when the backend is unavailable. This allows you to see how the search functionality would work once the backend is running.

## Next Steps
1. Start your backend server
2. Update the API URL if needed
3. Test the search functionality
4. The demo mode will automatically switch to real API calls once the backend is available
