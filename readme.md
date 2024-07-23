# Let's create a README file with the content provided.
readme_content = """
# Phonebook API

This is a simple RESTful API for managing a phonebook application. The API allows you to create, read, update, and delete contacts. It uses MongoDB for data storage and is built using Node.js and Express.

## Table of Contents

- [Phonebook API](#phonebook-api)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Running the Server](#running-the-server)
    - [API Endpoints](#api-endpoints)
  - [Testing](#testing)
  - [Docker](#docker)
  - [Environment Variables](#environment-variables)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- Add new contacts
- Edit existing contacts
- Delete contacts
- Retrieve contacts with pagination and search functionality

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- Winston (for logging)
- Mocha, Chai, Sinon (for testing)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/phonebook-api.git
    cd phonebook-api
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following environment variables:
    ```env
    MONGO_URI=mongodb://localhost:27017/phonebook
    PORT=5000
    ```

## Usage

### Running the Server

1. Make sure MongoDB is running on your machine or provide a remote MongoDB URI in the `.env` file.
2. Start the server:
    ```sh
    npm start
    ```

The server will start on `http://localhost:5000`.

### API Endpoints

- **GET /api/contacts/get-contacts**: Retrieve all contacts with pagination and search, prefix search for Phone/FirstName/LastName/Address, like our mobile do.
- **GET /api/contacts/get-all-contact**: Retrieve all contacts with pagination without search.
- **POST /api/contacts/create-contact**: Add a new contact (If this phone number is not in use by another contact).
- **GET /api/contacts/get-contact-by-id/:id**: Retrieve a single contact by ID.
- **GET /api/contacts/get-contact-by-phone:phone**: Retrieve a single contact by Phone.
- **PUT /api/contacts/update-contact/:id**: Update a contact by ID (If the new phone number is not in use by another contact).
- **DELETE /api/contacts/delete-contact/:id**: Delete a contact by ID.

## Testing

1. To run the unit and integration tests:
    ```sh
    npm test
    ```

## Docker

1. Build the Docker images and run the containers:
    ```sh
    docker-compose up --build
    ```

This will start the API server on `http://localhost:5000` and MongoDB on `mongodb://mongo:27017`.

## Environment Variables

- `MONGO_URI`: URI for connecting to MongoDB.
- `PORT`: Port number for the server.
