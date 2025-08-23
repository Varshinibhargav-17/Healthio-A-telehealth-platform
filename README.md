# HealthIO

HealthIO is a telehealth platform that allows providers to manage patient care, including billing and prescription functionalities. This application provides a seamless experience for both providers and patients.

## Features

- **Provider Dashboard**: Manage patient appointments, billing, and messaging.
- **Patient Dashboard**: View appointments, prescriptions, and billing information.
- **Billing Management**: Generate and manage bills for patients.
- **Prescription Management**: Upload and manage patient prescriptions.

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: Session-based authentication

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Clone the Repository

```bash
git clone https://github.com/yourusername/healthio.git
cd healthio
```

### Setup Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory and add your environment variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Setup Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

- Access the application at `http://localhost:5000` for the backend and `http://localhost:5173` for the frontend.
- Follow the prompts to log in as a provider or patient and manage your appointments, billing, and prescriptions.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
