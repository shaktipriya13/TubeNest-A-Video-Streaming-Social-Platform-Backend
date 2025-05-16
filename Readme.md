# TubeNest Backend

![TubeNest Backend](https://img.shields.io/badge/Node.js-Express.js-green)
A scalable RESTful API backend for  **TubeNest** , a YouTube-like platform where users can upload videos, comment, like, subscribe to channels, and create playlists. Built with  **Node.js** ,  **Express.js** ,  **MongoDB** , and **Cloudinary** for media management.

## Table of Contents

* [Features](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#features)
* [Tech Stack](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#tech-stack)
* [Project Structure](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#project-structure)
* [Setup Instructions](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#setup-instructions)
* [Environment Variables](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#environment-variables)
* [API Endpoints](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#api-endpoints)
* [Testing](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#testing)
* [Contributing](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#contributing)
* [License](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#license)

## Features

* **User Authentication** : Secure registration, login, and logout with JWT-based authentication.
* **Video Uploads** : Users can upload videos and thumbnails using Cloudinary for media storage.
* **Social Interactions** : Comment on videos, like videos/comments, and subscribe to channels.
* **Playlists** : Create and manage playlists with videos.
* **Health Check** : Monitor server and dependency status with a `/api/v1/healthcheck` endpoint.
* **Scalability** : Pagination for video and comment feeds using `mongoose-aggregate-paginate-v2`.
* **Modular Architecture** : Organized into controllers, routes, models, and utilities for maintainability.

## Tech Stack

* **Backend** : Node.js, Express.js
* **Database** : MongoDB with Mongoose
* **Media Storage** : Cloudinary
* **Authentication** : JSON Web Tokens (JWT)
* **File Uploads** : Multer
* **Testing** : Postman

## Project Structure

```
TubeNest-Backend/
│
├── src/
│   ├── controllers/        # Business logic for API endpoints
│   │   ├── comment.controller.js
│   │   ├── healthcheck.controller.js
│   │   ├── like.controller.js
│   │   ├── tweet.controller.js
│   │   ├── user.controller.js
│   │   └── video.controller.js
│   ├── middlewares/        # Custom middleware (e.g., auth, file uploads)
│   │   ├── auth.middleware.js
│   │   └── multer.middleware.js
│   ├── models/             # Mongoose schemas
│   │   ├── comment.model.js
│   │   ├── likes.model.js
│   │   ├── playlist.model.js
│   │   ├── subscription.model.js
│   │   ├── tweet.model.js
│   │   ├── user.model.js
│   │   └── video.model.js
│   ├── routes/             # API routes
│   │   ├── comment.routes.js
│   │   ├── healthcheck.routes.js
│   │   ├── like.routes.js
│   │   ├── playlist.routes.js
│   │   ├── subscription.routes.js
│   │   ├── tweet.routes.js
│   │   ├── user.routes.js
│   │   └── video.routes.js
│   ├── utils/              # Utility functions and classes
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── cloudinary.service.js
│   └── db/                 # Database connection
│       └── index.js
│
├── public/                 # Static files (e.g., temporary uploads)
│   └── temp/
├── .env                    # Environment variables (not tracked)
├── app.js                  # Express app setup
├── constants.js            # Constants (e.g., DB_NAME)
├── index.js                # Entry point
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```

## Setup Instructions

### Prerequisites

* **Node.js** (v16 or higher)
* **MongoDB** (local or MongoDB Atlas)
* **Cloudinary Account** (for media storage)
* **Postman** (for API testing)

### Installation

1. **Clone the Repository** :

```bash
   git clone https://github.com/yourusername/tubenest.git
   cd tubenest
```

1. **Install Dependencies** :

```bash
   npm install
```

1. **Set Up Environment Variables** :

* Create a `.env` file in the root directory.
* Add the following variables (replace with your own values):
  ```
  # Server
  PORT=8000
  NODE_ENV=development
  CORS_ORIGIN=http://localhost:3000

  # MongoDB
  MONGODB_URI=mongodb://localhost:27017/tubenest

  # Cloudinary
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret

  # JWT
  ACCESS_TOKEN_SECRET=your_access_token_secret
  ACCESS_TOKEN_EXPIRY=1d
  REFRESH_TOKEN_SECRET=your_refresh_token_secret
  REFRESH_TOKEN_EXPIRY=10d
  ```

1. **Start the Server** :

```bash
   npm start
```

* The server will run on `http://localhost:8000`.

## Environment Variables

The following environment variables are required in the `.env` file:

| Variable                  | Description                                                               |
| ------------------------- | ------------------------------------------------------------------------- |
| `PORT`                  | Port for the server (default: 8000)                                       |
| `NODE_ENV`              | Environment (development/production)                                      |
| `CORS_ORIGIN`           | Frontend URL for CORS (e.g.,[http://localhost:3000](http://localhost:3000/)) |
| `MONGODB_URI`           | MongoDB connection string                                                 |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                                                     |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                                                        |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                                                     |
| `ACCESS_TOKEN_SECRET`   | Secret for access token (JWT)                                             |
| `ACCESS_TOKEN_EXPIRY`   | Access token expiry (e.g., 1d)                                            |
| `REFRESH_TOKEN_SECRET`  | Secret for refresh token (JWT)                                            |
| `REFRESH_TOKEN_EXPIRY`  | Refresh token expiry (e.g., 10d)                                          |

## API Endpoints

### Base URL

`http://localhost:8000/api/v1`

### Authentication

| Method | Endpoint                 | Description         | Requires Auth |
| ------ | ------------------------ | ------------------- | ------------- |
| POST   | `/users/register`      | Register a new user | No            |
| POST   | `/users/login`         | Login a user        | No            |
| POST   | `/users/logout`        | Logout a user       | Yes           |
| PATCH  | `/users/update-avatar` | Update user avatar  | Yes           |

### Videos

| Method | Endpoint           | Description    | Requires Auth |
| ------ | ------------------ | -------------- | ------------- |
| POST   | `/videos/upload` | Upload a video | Yes           |

### Comments

| Method | Endpoint      | Description                 | Requires Auth |
| ------ | ------------- | --------------------------- | ------------- |
| POST   | `/comments` | Create a comment on a video | Yes           |

### Likes

| Method | Endpoint                  | Description  | Requires Auth |
| ------ | ------------------------- | ------------ | ------------- |
| POST   | `/likes/video/:videoId` | Like a video | Yes           |

### Tweets

| Method | Endpoint    | Description     | Requires Auth |
| ------ | ----------- | --------------- | ------------- |
| POST   | `/tweets` | Create a tweet  | Yes           |
| GET    | `/tweets` | Get user tweets | Yes           |

### Health Check

| Method | Endpoint         | Description         | Requires Auth |
| ------ | ---------------- | ------------------- | ------------- |
| GET    | `/healthcheck` | Check server health | No            |

### Other Routes (To Be Implemented)

* `/subscriptions`: Subscribe to channels.
* `/playlists`: Create and manage playlists.
* `/dashboard`: Creator analytics dashboard.

## Testing

1. **Run the Server** :

```bash
   npm start
```

1. **Use Postman** :

* Import the API endpoints into Postman.
* Test the `/users/register` and `/users/login` endpoints to get an `accessToken`.
* Add the `accessToken` to the `Authorization` header as `Bearer <token>` for authenticated routes.
* Example: Test `POST /api/v1/videos/upload` with a video file and thumbnail.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a Pull Request.
