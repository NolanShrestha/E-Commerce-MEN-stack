# E-commerce API

## Overview

The E-commerce API is a RESTful API built with Node.js, Express, and MongoDB that facilitates essential e-commerce functionalities, including product management, user authentication, shopping cart handling, and product reviews.

## Features

- User Registration & Login: Secure user registration and login with hashed passwords.
- Product Management: Admin only features to add, edit, and delete products.
- Cart Management: Users can add and remove items from their cart.
- Payment Processing: Simple payment processing for products with balance updates.
- Product Reviews: Users can leave ratings and comments on products.
- JWT Authentication: Secure access to routes and actions based on user roles
- Error Handling & Data Validation: Consistent error responses and validation for input fields.

## Prerequisites

- Node.js 
- npm (Node Package Manager)
- MongoDB 

## Getting Started

To use this API, you'll need a server running Node.js and MongoDB. After setting up your environment, you can clone the project and run it locally for development or production purposes.

### Installation

1. Clone the repository:

     git clone https://github.com/NolanShrestha/Ecommerce_API.git

2. Navigate into the project directory.

3. Install the required dependencies:

   npm install

4. Configure your MongoDB connection in the appropriate configuration files.

5. Start the server.

### Additional Notes 

- Role-Based Access: Only users with the 'admin' role can access product management routes.

- Password Security: Passwords are hashed before storage for security.

- Transaction Logging: Payments and other transactional data are logged in the MongoDB database.



