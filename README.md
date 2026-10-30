# URL Shortener

A full-stack URL Shortener application built with NestJS, React, TypeScript, and MongoDB. The application allows users to register, log in, create shortened URLs, and manage their URL history through a protected dashboard.

## Features

### Authentication
- User registration with name, email, and password.
- Secure password hashing using bcrypt.
- User login with JWT-based authentication.
- Protected routes for authenticated users.
- Logout functionality.

### URL Shortening
- Create short URLs from valid HTTP and HTTPS URLs.
- Generate unique short codes.
- Associate each shortened URL with its owner.
- View the logged-in user's URL history.
- Redirect visitors to the original URL using the short link.
- Track the number of clicks on each shortened URL.
- Validate user input and handle API errors.

### Frontend
- Registration and login pages.
- Protected dashboard.
- URL shortening form and URL history.
- Copy short links to the clipboard.
- Responsive user interface.
- Session restoration after refreshing the page.

## Tech Stack

### Backend
- Node.js
- NestJS
- TypeScript
- MongoDB
- Mongoose
- JWT authentication
- Passport.js
- bcryptjs
- class-validator and class-transformer

### Frontend
- React
- TypeScript
- Vite
- React Router
- Axios
- CSS

## Project Structure

```text
url-shortener/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── urls/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Prerequisites

Install the following before running the application:

- Node.js and npm
- MongoDB, either locally or through MongoDB Atlas
- Git
- Postman for API testing

## Installation and Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd url-shortener
```

Replace the placeholder with your actual repository URL.

### 2. Set up the backend

Open a terminal and navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and configure the required environment variables.

Example:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/url_shortener
JWT_SECRET=replace_with_a_strong_random_secret
JWT_EXPIRES_IN=15m
SHORT_URL_BASE=http://localhost:3000
```

Use the exact MongoDB environment variable name configured in your backend if it differs from `MONGODB_URI`.

- `MONGODB_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret used to sign and verify JWTs.
- `JWT_EXPIRES_IN`: Intended token expiry configuration; ensure the authentication module reads this variable if you want it to control token expiry.
- `SHORT_URL_BASE`: Base URL used to generate shareable short links.

Do not commit your actual `.env` file or expose your JWT secret in the repository.

Start the backend in development mode:

```bash
npm run start:dev
```

The backend should be available at:

```text
http://localhost:3000
```

API routes use the `/api` prefix, except the public short-link redirect route.

### 3. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```dotenv
VITE_API_URL=http://localhost:3000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite, normally:

```text
http://localhost:5173
```

Make sure the backend is running and its CORS configuration allows the frontend origin.

## API Endpoints

The backend exposes the following endpoints.

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/auth/register` | Register a user | No |
| POST | `/api/auth/login` | Log in and obtain a JWT | No |
| GET | `/api/auth/me` | Get the authenticated user's information | Yes |
| POST | `/api/auth/logout` | Logout endpoint | Yes |
| POST | `/api/urls` | Create a shortened URL | Yes |
| GET | `/api/urls` | Get the current user's URLs | Yes |
| GET | `/:code` | Redirect to the original URL | No |

For protected endpoints, send the JWT in the request header:

```http
Authorization: Bearer <YOUR_JWT_TOKEN>
```

The redirect endpoint is public so anyone with a valid short link can use it.

## Testing

### Manual API Testing with Postman

The backend endpoints have been tested manually using Postman.

Recommended test cases include:

1. Register a new user with valid details.
2. Attempt to register again using the same email.
3. Log in with valid credentials.
4. Attempt to log in with an incorrect password.
5. Access a protected endpoint without a JWT and verify that access is rejected.
6. Create a shortened URL with a valid JWT.
7. Submit an invalid URL and verify that validation rejects it.
8. Retrieve the authenticated user's URL history.
9. Verify that one user cannot retrieve another user's URLs.
10. Open a generated short link and verify the redirect.
11. Try an unknown short code and verify that a not-found response is returned.
12. Verify that the click count increases after redirecting.
13. Log out and verify that the frontend clears the locally stored token.

### Frontend Testing

1. Register a new account.
2. Log in with the registered account.
3. Refresh the dashboard and verify session restoration.
4. Create a short URL and verify that it appears in the URL history.
5. Copy a short link and open it in a browser.
6. Log out and verify that the dashboard is protected.

### Automated Tests

Automated test coverage should be added and run separately before claiming the project has a complete automated test suite. The manual Postman tests described above do not replace automated unit or end-to-end tests.

## Deployment

The application can be deployed by hosting the backend and frontend and configuring the production environment variables.

### Backend Deployment

1. Push the backend code to a GitHub repository.
2. Choose a hosting provider that supports Node.js applications.
3. Configure a production MongoDB connection.
4. Set the required environment variables in the hosting provider's environment settings.
5. Build and start the application using the appropriate production commands.

Typical NestJS commands:

```bash
npm run build
npm run start:prod
```

Configure the deployed backend to use HTTPS and an appropriate CORS origin.

### Frontend Deployment

1. Push the frontend code to a GitHub repository.
2. Choose a static hosting provider that supports Vite applications.
3. Set `VITE_API_URL` to the deployed backend API URL, including the `/api` prefix.
4. Build the frontend:

```bash
npm run build
```

5. Deploy the generated `dist` directory.
6. Configure the hosting provider to serve the React application correctly when users open or refresh application routes such as `/login` and `/dashboard`.

Update `SHORT_URL_BASE` in the backend environment to the public backend domain used for short links. Ensure the root-level `/:code` redirect route remains accessible.

**Deployment status:** Add the actual deployment URLs here after deployment is complete.

- Frontend: `<YOUR_FRONTEND_DEPLOYMENT_URL>`
- Backend: `<YOUR_BACKEND_DEPLOYMENT_URL>`

## Security Considerations

- Passwords are stored as hashes rather than plain text.
- JWT authentication protects user-specific URL operations.
- URL history is filtered by the authenticated user's ID.
- Request validation is performed using NestJS validation tools.
- Environment secrets should not be committed to Git.
- Production deployments should use HTTPS and appropriately restricted CORS settings.

The current logout implementation clears the frontend session but does not revoke an already-issued stateless JWT on the server. The token remains usable until it expires unless server-side revocation is implemented.

## AI Assistance Disclosure

AI-assisted development tools, including ChatGPT, were used during the development of this project.

They helped with understanding NestJS architecture, planning the folder structure, implementing and explaining modules, writing and reviewing code, integrating the React frontend with the backend APIs, troubleshooting errors, and preparing testing procedures and documentation.

AI assistance improved development speed and supported learning by providing explanations of authentication, dependency injection, JWT handling, API integration, and reusable component design. The generated code was reviewed, adapted to the project, and tested manually using Postman.

AI tools were used as development assistants; understanding, validating, and maintaining the final implementation remain the developer's responsibility.

## Future Improvements

- Add automated unit and end-to-end tests.
- Add pagination and search to URL history.
- Implement server-side JWT revocation or another robust logout strategy.
- Add rate limiting and further production security hardening.
- Improve error logging and monitoring.

## Author

Developed as a learning and technical assessment project to demonstrate full-stack development using NestJS, React, TypeScript, MongoDB, and JWT authentication.
