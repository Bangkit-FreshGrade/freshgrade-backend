![FG](https://raw.githubusercontent.com/Afwann/profile-assets/main/FG.png)

# FreshGrade Backend

Welcome to the backend repository of FreshGrade, a smart agricultural technology solution aimed at improving the efficiency and safety of fruit trading in Indonesia. This backend service is built to handle user authentication, data records, and machine learning functions for the FreshGrade mobile application.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [License](#license)

## Introduction

FreshGrade backend is built using the Express.js framework from Node.js. It provides RESTful APIs for user authentication, data management, and communication with the machine learning model for fruit condition recognition.

## Features

- **User Authentication**: Secure registration and login with JWT-based authentication.
- **Fruit Condition Recognition**: API endpoints for image processing and condition evaluation.
- **Data Records**: Save and retrieve user recognition results.
- **Continuous Integration/Continuous Deployment**: Automated deployment with Docker.

## Architecture

![Architecture Diagram](https://raw.githubusercontent.com/Afwann/profile-assets/main/Architecture_Freshgrade.drawio.png)

The backend service is deployed as a container on Google Cloud Platform using Docker. It communicates with a pre-trained machine learning model for image classification and interacts with a database for storing user data.

## Getting Started

### Prerequisites

Ensure you have the following installed on your local development machine:

- Node.js
- NPM (Node Package Manager)
- Docker

### Installation

1. Clone the Repository :
    ```bash
    git clone https://github.com/Bangkit-FreshGrade/freshgrade-backend.git
    cd freshgrade-backend
    ```
2. Environment Set Up :
    ```bash
    cp .env.dev.example .env
    ```
3. Install Dependecies :
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```
4. Start and run Docker :
    ```bash
    docker-compose up -d
    ```
5. Push new schema to database :
    ```bash
    npx prisma db push
    ```
    or 
    ```bash
    yarn prisma db push
    ```
6. Seed the database :
    ```bash
    npx prisma db seed
    ```

## Running the Application 
Run application in Development mode :
```bash
npm run dev
```
or 
```bash
yarn dev
```

## API Documentation

The following table contains Postman collections for practicing with the back-end.
| Collection | Postman Link |
|:---:|:---:|
| Backend API collection | [![Run in Postman](https://run.pstmn.io/button.svg)]()

## Project Structure
```bash
freshgrade-backend
├── LICENSE
├── README.md
├── docker-compose.yml
├── package-lock.json
├── package.json
├── prisma
│   └── schema.prisma
├── src
│   ├── app.ts
│   ├── common
│   │   └── guard
│   │       └── at.guard.ts
│   ├── dto
│   │   ├── change-password.dto.ts
│   │   └── user.dto.ts
│   ├── model
│   │   └── http-exception.model.ts
│   ├── plugins
│   │   └── prisma
│   │       └── prisma.service.ts
│   ├── routes
│   │   ├── articles
│   │   │   └── article.controller.ts
│   │   ├── auth
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.spec.ts
│   │   │   └── token.utils.ts
│   │   ├── routes.ts
│   │   └── scanner
│   │       ├── scanner.controller.ts
│   │       └── scanner.service.ts
│   ├── seed.ts
│   └── types
│       ├── inputImage.type.ts
│       ├── jwtPayload.type.ts
│       ├── tokens.type.ts
│       └── userResponse.type.ts
└── tsconfig.json
```



## Lincense

This Project is licensed under the MIT License - see the [LICENSE](https://github.com/Bangkit-FreshGrade/freshgrade-backend/blob/main/LICENSE) file for details.

Thank you for using FreshGrade! If you have any questions or need further assistance, please open an issue in this repository.