# Taskify
Taskify is a simple task management application built using the MERN stack (MongoDB, Express.js, React, and Node.js). This app allows users to create, update, and delete projects and tasks efficiently. 

## Features
- User authentication (sign up, login, logout)
- Create, read, update, and delete Projects
- Add other users to your project team
- Create, read, update, and delete tasks
- assign task to team members
- Mark tasks as completed

## Getting Started
### Pre-rquisites
- Node >= 18.17.0
- MongoDB
- Docker (Optional)

### Installation
1. #### Clone the Repository
   ```git clone https://github.com/your-username/taskify.git
   cd tm-fullstack/tm-backend
   ```
2. #### Create a .env file in backend folder
   ```MONGO_URI=<Your mongo db uri>
   CORS_ORIGIN=http://localhost:5173
   PORT=8080
   ACCESS_TOKEN_SECRET=<Your access token secret>
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=<Your refresh token secret>
   REFRESH_TOKEN_EXPIRY=10d   
   ```
3. #### Install dependencies and start projects
    ```npm i
    npm run dev
    cd ../tm-frontend
    npm i
    npm run dev    
    ```
4. #### Access the application
   open browser and go to http://localhost:5173

### Installation with Docker compose
1. #### Clone the Repository
   ```git clone https://github.com/your-username/taskify.git
   cd tm-fullstack/tm-backend
   ```
2. #### Run docker compose command
   `docker-compose up -d`

4. #### Access the application
   open browser and go to http://localhost:80

