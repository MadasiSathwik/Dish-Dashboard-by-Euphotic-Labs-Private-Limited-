# Dish Dashboard

A full-stack web application to manage dishes and their publishing status.

## Features

* View all dishes
* Publish/Unpublish dishes
* MongoDB database integration
* REST APIs using Express.js
* Responsive React dashboard
* Real-time updates using Socket.IO and MongoDB Change Streams

## Tech Stack

* React (Vite)
* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.IO
* Axios

## Project Structure

```
Dish-Dashboard/
├── backend/
├── frontend/
├── README.md
└── .gitignore
```

## Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

* GET `/api/dishes`
* PATCH `/api/dishes/:dishId`

## Bonus

Implemented real-time updates using MongoDB Change Streams and Socket.IO.
