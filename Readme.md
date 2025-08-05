AI-Powered Agriculture Recommendation System Backend
This repository contains the backend for an AI-powered agriculture recommendation system. It allows users to upload soil test reports, which are then analyzed by an AI model to provide detailed, actionable recommendations for crop selection, fertilizer usage, and more.

Table of Contents
Features

Tech Stack

Project Structure

Getting Started

Prerequisites

Installation

Environment Variables

Available Scripts

API Endpoints

Authentication

User

Reports

Admin

Database Schema

Features
JWT Authentication: Secure user and admin authentication using JSON Web Tokens.

Role-Based Access Control: Differentiated access and capabilities for regular users and administrators.

Soil Report Management: Users can upload soil reports in various formats (PDF, DOCX, TXT, images).

AI-Powered Analysis: Utilizes OpenAI's GPT-4 to perform in-depth analysis of soil reports, providing recommendations for:

Crop Suitability

Fertilizers & Pesticides

Soil Deficiencies

And more, delivered in a structured JSON format.

Asynchronous Job Processing: AI analysis is handled in the background to prevent blocking and provide a smooth user experience.

User & Admin Dashboards: Endpoints to fetch aggregated statistics for both user and admin dashboards.

Full Admin Control: Admins can view all users and reports, manage user roles, and delete users.

Secure & Robust API: Implemented with security best practices using helmet, cors, and express-rate-limit.

Pagination & Filtering: Efficiently retrieve lists of users and reports with server-side pagination.

Tech Stack
Backend: Node.js, Express.js

Database: PostgreSQL

ORM: Prisma

Authentication: bcryptjs (hashing), jsonwebtoken (JWT)
--   AI: OpenAI API (gpt-4)

File Handling: multer (uploads), pdf-parse (PDF text extraction)

Security: helmet, cors, express-rate-limit

Validation: express-validator

Project Structure
agriculture-backend/
├── config/
│   └── database.js         # Prisma client configuration
├── middleware/
│   └── auth.js             # Authentication & authorization middleware
├── node_modules/
├── prisma/
│   └── schema.prisma       # Database schema definition
├── routes/
│   ├── admin.js            # Routes for admin panel
│   ├── auth.js             # Routes for authentication
│   ├── reports.js          # Routes for handling reports
│   └── user.js             # Routes for user dashboard & profile
├── services/
│   ├── aiService.js        # Logic for OpenAI API interaction
│   └── fileProcessor.js    # Logic for processing uploaded files
├── uploads/
│   └── reports/            # Directory for storing uploaded reports
├── .env                    # Environment variables (needs to be created)
├── .gitignore
├── package.json
└── server.js               # Main server entry point
Getting Started
Follow these instructions to get the project up and running on your local machine.

Prerequisites
Node.js (v18 or newer)

NPM

PostgreSQL installed and running

An OpenAI API Key

Installation
Clone the repository:

Bash

git clone https://github.com/your-username/agriculture-backend.git
cd agriculture-backend
Install dependencies:

Bash

npm install
Set up the database:

Log in to PostgreSQL and create a new database.

SQL

CREATE DATABASE agriculture_db;
Set up environment variables:

Create a .env file in the root of the project by copying the example below.

Update the DATABASE_URL with your PostgreSQL credentials.

Add your OPENAI_API_KEY.

Initialize Prisma and sync the database:

This command will set up the Prisma environment.

Bash

npx prisma init
Generate the Prisma client based on your schema.

Bash

npm run db:generate
Push the schema to your database. This will create the tables and columns.

Bash

npm run db:push
Start the server:

To start the server in development mode with live-reloading:

Bash

npm run dev
The server will be running at http://localhost:3000.

Environment Variables
Create a .env file in the root directory and add the following variables:

Code snippet

# Database
# Replace 'username' and 'password' with your PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/agriculture_db?schema=public"

# JWT
# Use a long, complex, and random string for security
JWT_SECRET="your_super_secret_jwt_key_here_make_it_long_and_complex"

# OpenAI
# Your secret API key from the OpenAI platform
OPENAI_API_KEY="your_openai_api_key_here"

# Server Configuration
PORT=3000
NODE_ENV="development" # 'production' or 'development'
Available Scripts
npm start: Starts the server in production mode.

npm run dev: Starts the server in development mode using nodemon for live-reloading.

npm run db:generate: Generates the Prisma client from your schema.

npm run db:push: Pushes the current state of your Prisma schema to the database without using migrations.

npm run db:migrate: Creates and applies a new migration to the database.

npm run db:studio: Opens Prisma Studio, a GUI for your database.

API Endpoints
All endpoints are prefixed with /api.

Authentication
Method	Endpoint	Description
POST	/auth/register	Registers a new user (USER or ADMIN).
POST	/auth/login	Logs in a user and returns a JWT.
POST	/auth/logout	Logs out the user (client should delete token).
GET	/auth/me	Gets the profile of the currently logged-in user.

Export to Sheets
User
Requires authentication.

Method	Endpoint	Description
GET	/user/dashboard	Fetches statistics for the user dashboard.
PUT	/user/profile	Updates the user's JSON profile data.

Export to Sheets
Reports
Requires authentication.

Method	Endpoint	Description
POST	/reports/upload	Uploads a soil report file for AI analysis.
GET	/reports/my-reports	Fetches a paginated list of the user's reports.
GET	/reports/:id	Retrieves a single report's full details and analysis.
GET	/reports/:id/status	Checks the current analysis status of a report.

Export to Sheets
Admin
Requires ADMIN role authentication.

Method	Endpoint	Description
GET	/admin/dashboard	Fetches statistics for the admin dashboard.
GET	/admin/users	Gets a paginated list of all users.
PUT	/admin/users/:id/role	Updates a specific user's role.
DELETE	/admin/users/:id	Deletes a user from the database.
GET	/reports/admin/all	Gets a paginated list of all reports from all users.

