# 🚀 Social Media Backend

A RESTful API for a social media application built with **Node.js, Express.js, MongoDB, and Mongoose**. This backend provides secure user authentication, profile management, posts, likes, comments, following functionality, and a personalized feed.

## 🛠️ Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

## ✨ Features

- 🔐 **Authentication & Authorization** — User registration, login, JWT authentication, and protected API routes.
- 🔒 **Password Security** — Password hashing with bcrypt.
- 👤 **User Profiles** — View and update profile information, including name, bio, avatar URL, and website.
- 🔎 **User Search** — Search users by name or username.
- 🤝 **Follow System** — Follow and unfollow other users.
- 📝 **Post Management** — Create, retrieve, update, and delete posts.
- ❤️ **Like System** — Like and unlike posts.
- 💬 **Comments** — Add comments to posts and delete your own comments.
- 📰 **Personalized Feed** — View posts from yourself and users you follow.
- 📄 **Pagination** — Retrieve feed posts in manageable pages.
- 🛡️ **Access Control** — Restrict post editing, post deletion, and comment deletion to their owners.
- ⚠️ **Error Handling** — Centralized error responses for common API errors.
- 💚 **Health Check** — Verify that the API server is responding.

## 📁 Project Structure

```text
social-media-backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── post.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── post.routes.js
│   │   └── comment.routes.js
│   └── utils/
│       └── asyncHandler.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or later)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- npm (included with Node.js)
- Git (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/ajinkya029/social-media-backend.git
cd social-media-backend
```

Replace `YOUR_USERNAME` with your GitHub username and adjust the repository URL if necessary.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root by copying `.env.example`.

**Windows Command Prompt:**

```cmd
copy .env.example .env
```

**PowerShell:**

```powershell
Copy-Item .env.example .env
```

Update the `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/social_media_db
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

For MongoDB Atlas, replace the local `MONGODB_URI` with your Atlas connection string.

**Important:** Use a strong, private JWT secret and never commit your `.env` file to GitHub.

### 4. Start the Server

Start the development server with automatic restarts:

```bash
npm run dev
```

Or start the application normally:

```bash
npm start
```

The server will run at:

```text
http://localhost:5000
```

### 5. Verify the API

Open the following URL in your browser or API testing tool:

```http
GET http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "social-media-backend"
}
```

## 🔑 Authentication

Most API endpoints require a JWT access token.

After registering or logging in, copy the returned token and include it in the `Authorization` header of protected requests.

```http
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

## 📡 API Documentation

Base URL:

```text
http://localhost:5000/api
```

### 🔐 Authentication Routes

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Log in | No |
| GET | `/auth/me` | Get current user | Yes |

**Register request body:**

```json
{
  "name": "Jane Doe",
  "username": "janedoe",
  "email": "jane@example.com",
  "password": "password123"
}
```

**Login request body:**

```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

Successful registration and login return the user information and a JWT token.

### 👥 User Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users/search?q=jane` | Search users |
| GET | `/users/:username` | Retrieve a user profile |
| GET | `/users/:username/posts` | Retrieve posts by username |
| PATCH | `/users/me/profile` | Update your profile |
| POST | `/users/:id/follow` | Follow or unfollow a user |

All user routes require authentication.

**Update profile request body:**

```json
{
  "name": "Jane D.",
  "bio": "Building amazing things with code.",
  "avatar": "https://example.com/avatar.jpg",
  "website": "https://example.com"
}
```

### 📝 Post Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/posts/feed?page=1&limit=10` | Retrieve personalized feed |
| POST | `/posts` | Create a post |
| GET | `/posts/:id` | Retrieve a specific post |
| PATCH | `/posts/:id` | Update your own post |
| DELETE | `/posts/:id` | Delete your own post |
| POST | `/posts/:id/like` | Like or unlike a post |

All post routes require authentication.

**Create post request body:**

```json
{
  "text": "Hello everyone! Welcome to my social media app.",
  "imageUrl": "https://example.com/image.jpg"
}
```

A post must contain non-empty text, an image URL, or both.

### 💬 Comment Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/posts/:id/comments` | Add a comment |
| DELETE | `/posts/:id/comments/:commentId` | Delete your own comment |

All comment routes require authentication.

**Add comment request body:**

```json
{
  "text": "Great post! Keep it up."
}
```

### 📄 Feed Pagination

Retrieve posts using query parameters:

```http
GET /api/posts/feed?page=1&limit=10
```

| Parameter | Description | Default |
|---|---|---|
| `page` | Page number | `1` |
| `limit` | Number of posts per page | `10` |

The API limits page size to a maximum of 50 posts.

## 🗄️ Database Models

### User

Stores user information, securely hashed passwords, profile details, followers, and following relationships.

### Post

Stores the author, text content, image URL, likes, comments, and timestamps.

### Comment

Stores the associated post, author, comment text, and timestamps.

MongoDB references and Mongoose models connect these entities.

## 🧪 Testing the API

You can test the endpoints using:

- [Postman](https://www.postman.com/)
- [Thunder Client](https://www.thunderclient.com/)
- [Insomnia](https://insomnia.rest/)

Recommended testing sequence:

1. Register two users.
2. Log in and save the JWT tokens.
3. Follow the second user from the first account.
4. Create a post.
5. Retrieve the personalized feed.
6. Like the post and add a comment.
7. Update or delete your own post.
8. Verify that unauthorized ownership changes are rejected.

## 🔮 Future Enhancements

- 🖼️ Image uploads using Cloudinary or Amazon S3
- 🔔 Real-time notifications using Socket.IO
- 💬 Real-time direct messaging
- 🔖 Save and bookmark posts
- 🏷️ Hashtags and post discovery
- 🧪 Automated unit and integration tests
- 📚 Swagger/OpenAPI documentation
- 🚦 Rate limiting and request validation
- 🚀 Deployment with a production MongoDB database
- ⚛️ React frontend integration

## 🔐 Security Notes

- Passwords are hashed using bcrypt before being stored.
- Protected endpoints require a valid JWT.
- Post and comment ownership is checked before deletion.
- Configure a strong JWT secret before deployment.
- Use HTTPS and production-grade environment configuration when deploying.
- Add rate limiting and comprehensive request validation before exposing the API publicly.

## 👨‍💻 Author

**Ajinkya Dhatrak**

GitHub: [ajinkya029](https://github.com/ajinkya029)

## 📄 License

This project is available under the MIT License. Add a `LICENSE` file to the repository if you intend to distribute it under that license.
