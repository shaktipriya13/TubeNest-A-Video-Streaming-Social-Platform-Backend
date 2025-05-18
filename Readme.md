
# TubeNest Backend

TubeNest is a scalable RESTful API backend for a YouTube-like video streaming and social platform. Users can upload videos, like, subscribe to channels, manage playlists, and view analytics on a dashboard. Built with Node.js, Express.js, MongoDB, and Cloudinary, it offers secure authentication, efficient media handling, and paginated feeds.

## Table of Contents

* [Key Features](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#key-features)
* [Tech Stack](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#tech-stack)
* [Live Deployment](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#live-deployment)
* [API Documentation](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#api-documentation)
* [Setup Locally](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#setup-locally)
* [Project Structure](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#project-structure)
* [Environment Variables](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#environment-variables)
* [API Endpoints](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#api-endpoints)
* [Testing](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#testing)
* [Contributing](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#contributing)
* [License](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#license)

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
* **Package Manager** : Yarn

## Live Deployment

* **API Base URL** : [https://tubenest-a-video-streaming-social.onrender.com/](https://tubenest-a-video-streaming-social.onrender.com/)
* **Note** : The backend is deployed on Render’s free tier, so it may spin down after inactivity. The first request after a period of inactivity might take a few seconds to respond while the server spins up.

The backend is live and accessible for testing with the Postman collection.

## API Documentation

Test the TubeNest APIs using the provided Postman collection:

* **Download Postman Collection** : Located at `./docs/TubeNest-API-Collection.json`.
* **Public Postman Link** : *(Add if shared publicly)*

### How to Use the Postman Collection

1. Import `TubeNest-API-Collection.json` into Postman.
2. Set the base URL to `https://tubenest-a-video-streaming-social.onrender.com/`.
3. Test endpoints such as:
   * `GET /api/v1/videos`: Retrieve paginated videos
   * `POST /api/v1/users/register`: Register a user
   * `POST /api/v1/videos`: Upload a video (requires JWT token)

For protected routes, obtain a JWT token via `POST /api/v1/users/login` and include it in the `Authorization` header as `Bearer <token>`.

## Setup Locally

### Prerequisites

* **Node.js** : >=20.15.0
* **MongoDB** : Local or MongoDB Atlas
* **Cloudinary** : Account for media storage
* **Postman** : For API testing
* **Yarn** : Package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shaktipriya13/TubeNest-A-Video-Streaming-Social-Platform-Backend.git
   cd TubeNest-A-Video-Streaming-Social-Platform-Backend
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Create a `.env` file in the root directory (see [Environment Variables](https://grok.com/chat/919543d5-a15f-4ba4-ba21-f0bd4f1b7035?referrer=website#environment-variables)).
4. Start the server:
   ```bash
   yarn dev
   ```

The server runs on `http://localhost:8000` by default.

## Project Structure

```
TubeNest-A-Video-Streaming-Social-Platform-Backend/
│
├── src/
│   ├── controllers/        # Business logic for API endpoints
│   │   ├── comment.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── healthcheck.controller.js
│   │   ├── like.controller.js
│   │   ├── subscription.controller.js
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
│   │   ├── user.model.js
│   │   └── video.model.js
│   ├── routes/             # API routes
│   │   ├── comment.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── healthcheck.routes.js
│   │   ├── like.routes.js
│   │   ├── playlist.routes.js
│   │   ├── subscription.routes.js
│   │   ├── user.routes.js
│   │   └── video.routes.js
│   ├── utils/              # Utility functions and classes
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── cloudinary.service.js
│   ├── db/                 # Database connection
│   │   └── index.js
│
├── public/                 # Static files (e.g., temporary uploads)
│   └── temp/
├── .env                    # Environment variables (not tracked)
├── app.js                  # Express app setup
├── constants.js            # Constants (e.g., DB_NAME)
├── index.js                # Entry point
├── package.json            # Dependencies and scripts
├── yarn.lock               # Yarn dependency lockfile
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
# For MongoDB Atlas: MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.bedvtlg.mongodb.net/tubenest
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

1. Start the server:
   ```bash
   yarn dev
   ```
2. Import the Postman collection (`./docs/TubeNest-API-Collection.json`).
3. Test unauthenticated routes (e.g., `/users/register`, `/users/login`).
4. Obtain a JWT token via `/users/login` and add it to the `Authorization` header (`Bearer <token>`) for protected routes.
5. Example: Test `POST /api/v1/videos` with a video file and thumbnail.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License

MIT
