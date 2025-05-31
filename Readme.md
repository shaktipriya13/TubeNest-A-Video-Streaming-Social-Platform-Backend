# TubeNest Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white)

TubeNest is a scalable RESTful API backend for a YouTube-like video streaming and social platform. Users can upload videos, like, subscribe to channels, manage playlists, and view analytics on a dashboard. Built with Node.js, Express.js, MongoDB, and Cloudinary, it offers secure authentication, efficient media handling, and paginated feeds.

## Table of Contents

* [Key Features](#key-features)
* [Tech Stack](#tech-stack)
* [Live Deployment](#live-deployment)
* [API Documentation](#api-documentation)
* [Setup Locally](#setup-locally)
* [Project Structure](#project-structure)
* [Environment Variables](#environment-variables)
* [API Endpoints](#api-endpoints)
* [Testing](#testing)
* [Contributing](#contributing)

## Key Features

* **User Management** : Register, login, logout, update profiles, and manage avatars.
* **Video Uploads** : Upload and stream videos with thumbnails via Cloudinary.
* **Social Interactions** : Like and subscribe to channels.
* **Playlist Management** : Create and manage video playlists.
* **Analytics Dashboard** : View channel analytics and stats.
* **Authentication** : Secure JWT-based authentication for protected routes.
* **Media Management** : Efficient video, thumbnail, and avatar storage with Cloudinary.
* **Health Monitoring** : Health check endpoint to monitor server and dependencies.
* **Scalable Feeds** : Paginated video feeds using `mongoose-aggregate-paginate-v2`.
* **Error Handling** : Custom `ApiError` and `ApiResponse` classes for consistent responses.

## Tech Stack

* **Backend** : Node.js, Express.js
* **Database** : MongoDB with Mongoose
* **Pagination** : `mongoose-aggregate-paginate-v2`
* **Media Storage** : Cloudinary
* **Authentication** : JSON Web Tokens (JWT)
* **File Uploads** : Multer
* **Testing** : Postman
* **Deployment** : Render
* **Package Manager** : npm

## Live Deployment

* **API Base URL**:  
  🔗 [https://tubenest-backend-a-video-streaming-social.onrender.com/](https://tubenest-backend-a-video-streaming-social.onrender.com/)
* **Note** : The backend is deployed on Render’s free tier, so it may spin down after inactivity. The first request after a period of inactivity might take a few seconds to respond while the server spins up.

The backend is live and accessible for testing with the Postman collection.

## API Documentation

Easily test and explore the TubeNest APIs using the provided Postman collection, which includes pre-configured requests for all major endpoints.

* **Download Postman Collection** : [TubeNest Backend API Collection](https://grok.com/chat/docs/TubeNest-Backend-API-Collection.json)
* **Download Postman Environment (Optional)** : [TubeNest Backend Environment](https://grok.com/chat/docs/TubeNest-Backend-Env.json)
* **Public Postman Workspace** : *(Add a public link if you choose to share it on Postman’s public workspace)*

## How to Use the Postman Collection

### 📥 Import the Collection:
1. Download the Postman collection from the link above.
2. In Postman, go to **Import > Files**, and select `TubeNest-Backend-API-Collection.json`.

### 🌐 Set the Base URL:
Since the environment file is not included, you’ll need to manually set the base URL:
- Replace all instances of `{{base_url}}` in the request URLs with:  
  `https://tubenest-backend-a-video-streaming-social.onrender.com`

### 🚀 Test Endpoints:

#### ✅ Unauthenticated Endpoints:
- `GET /api/v1/healthcheck` – Check server health.
- `POST /api/v1/users/register` – Register a user.
- `POST /api/v1/users/login` – Log in a user.

#### 🔐 Protected Endpoints (e.g., `POST /api/v1/videos`):
1. Log in using `POST /api/v1/users/login` to receive a **JWT access token**.
2. Copy the `accessToken` from the response.
3. Add the token in the request’s **Authorization header**:

Authorization: Bearer <your_token_here>
> This setup allows you to interact with the full range of authenticated and unauthenticated TubeNest API endpoints directly from Postman.


### Example Requests

* **Register a User** :
* Endpoint: `POST /api/v1/users/register`
* Body (form-data):
  * `username`: `testuser`
  * `email`: `testuser@example.com`
  * `fullName`: `Test User`
  * `password`: `test1234`
  * `avatar`: (Upload an image file)
  * `coverImage`: (Upload an image file)
* Expected Response: `201 Created`
  ```json
  {
    "success": true,
    "data": {
      "user": { "username": "testuser", "email": "testuser@example.com", ... },
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
  ```
* **Login a User** :
* Endpoint: `POST /api/v1/users/login`
* Body (raw JSON):
  ```json
  {
    "email": "testuser@example.com",
    "password": "test1234"
  }
  ```
* Expected Response: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "user": { "username": "testuser", "email": "testuser@example.com", ... },
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
  ```

## Setup Locally

### Prerequisites

* **Node.js** : >=20.15.0
* **MongoDB** : Local or MongoDB Atlas
* **Cloudinary** : Account for media storage
* **Postman** : For API testing
* **npm** : Package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shaktipriya13/TubeNest-A-Video-Streaming-Social-Platform-Backend.git
   cd TubeNest-A-Video-Streaming-Social-Platform-Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory (see [Environment Variables](#environment-variables)).
4. Start the server:
   ```bash
   npm start
   ```

The server runs on `http://localhost:8000` by default.

## Project Structure

```



│
├── src/
│   ├── controllers/        # Business logic for API endpoints
│   ├── middlewares/        # Custom middleware (e.g., auth, file uploads)
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions and classes
│   ├── db/                 # Database connection
│   ├── app.js              # Express app setup
│   ├── constants.js        # Constants (e.g., DB_NAME)
│   ├── index.js            # Entry point
│
├── docs/   
│   └── TubeNest-Backend-API-Collection.json  # Postman collection for API testin
├── public/                 # Static files (e.g., temporary uploads)
│   └── temp/
├── .env                    # Environment variables (not tracked)
├── package.json            # Dependencies and scripts
├── package-lock.json       # npm dependency lockfile
└── README.md               # Project documentation
       

```

## Environment Variables

Create a `.env` file with the following variables:

| Variable                  | Description                                                               |
| ------------------------- | ------------------------------------------------------------------------- |
| `PORT`                  | Server port (default: 8000)                                               |
| `NODE_ENV`              | Environment (development/production)                                      |
| `CORS_ORIGIN`           | Frontend URL for CORS (e.g.,[http://localhost:5173](http://localhost:5173/)) |
| `MONGODB_URI`           | MongoDB connection string                                                 |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                                                     |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                                                        |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                                                     |
| `ACCESS_TOKEN_SECRET`   | JWT access token secret                                                   |
| `ACCESS_TOKEN_EXPIRY`   | Access token expiry (e.g., 1d)                                            |
| `REFRESH_TOKEN_SECRET`  | JWT refresh token secret                                                  |
| `REFRESH_TOKEN_EXPIRY`  | Refresh token expiry (e.g., 10d)                                          |

### Example `.env`:

```env
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/tubenest
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
```

## API Endpoints

 **Base URL** : `https://tubenest-a-video-streaming-social.onrender.com/api/v1`

### Authentication

| Method | Endpoint                 | Description         | Auth Required |
| ------ | ------------------------ | ------------------- | ------------- |
| POST   | `/users/register`      | Register a new user | No            |
| POST   | `/users/login`         | Login a user        | No            |
| POST   | `/users/logout`        | Logout a user       | Yes           |
| PATCH  | `/users/update-avatar` | Update user avatar  | Yes           |

### Videos

| Method | Endpoint    | Description           | Auth Required |
| ------ | ----------- | --------------------- | ------------- |
| GET    | `/videos` | List paginated videos | No            |
| POST   | `/videos` | Upload a video        | Yes           |

### Likes

| Method | Endpoint                  | Description  | Auth Required |
| ------ | ------------------------- | ------------ | ------------- |
| POST   | `/likes/video/:videoId` | Like a video | Yes           |

### Subscriptions

| Method | Endpoint           | Description            | Auth Required |
| ------ | ------------------ | ---------------------- | ------------- |
| POST   | `/subscriptions` | Subscribe to a channel | Yes           |

### Playlists

| Method | Endpoint       | Description       | Auth Required |
| ------ | -------------- | ----------------- | ------------- |
| POST   | `/playlists` | Create a playlist | Yes           |

### Dashboard

| Method | Endpoint       | Description           | Auth Required |
| ------ | -------------- | --------------------- | ------------- |
| GET    | `/dashboard` | Get channel analytics | Yes           |

### Health Check

| Method | Endpoint         | Description         | Auth Required |
| ------ | ---------------- | ------------------- | ------------- |
| GET    | `/healthcheck` | Check server health | No            |

### Planned Features

* `/comments`: Comment on videos

## Testing

1. Start the server locally or use the live deployment URL.
2. Import the Postman collection from the [API Documentation](#api-documentation) section.
3. Test unauthenticated routes (e.g., `/users/register`, `/users/login`).
4. Obtain a JWT token via `/users/login` and add it to the `Authorization` header (`Bearer <token>`) for protected routes.
5. Example: Test `POST /api/v1/videos` with a video file and thumbnail.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.
