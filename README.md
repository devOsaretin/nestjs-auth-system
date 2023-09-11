# NestJS Authentication System

## Overview

This project is an authentication system developed using NestJS, PostgreSQL hosted in a Docker container, TypeORM as the ORM, and Passport JWT for authentication. 





## Features

- Client Registration with Image Upload
- Client Login
- Authenticated Client Verification


## Prerequisites

Before running the project, make sure you have the following prerequisites installed:

- [Node.js](https://nodejs.org/) (16+)
- [Docker](https://www.docker.com/get-started)
- [PostgreSQL](https://www.postgresql.org/) (if not using Docker)
## Getting Started

Clone the project

```bash
  git clone https://github.com/devOsaretin/nestjs-auth-system.git
```


## Environment Variables

To run this project, you will need to create `.env.development`at the root of this project, add the following environment variables.


`POSTGRES_HOST`

`POSTGRES_USER`

`POSTGRES_PASSWORD`

`POSTGRES_DB`

`POSTGRES_PORT`

`POSTGRES_SYNCHRONIZE=true`

`AWS_ACCESS_KEY_ID`

`AWS_SECRET_ACCESS_KEY`

`AWS_REGION`

`AWS_BUCKET_NAME`

`SALT_ROUNDS=10`

`JWT_SECRET`

`JWT_EXPIRES=1d`


## Run Locally

Clone the project if you have not done so

```bash
  git clone https://github.com/devOsaretin/nestjs-auth-system.git
```

Go to the project directory

```bash
   cd <into the root of the project>
```

Start the database container

```bash
  docker-compose up
```
Open project in another terminal

```bash
  cd <into the root of the project>
```
Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start:dev
```


## API Reference

#### Register 

```http
  POST /api/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `firstName` | `string` | **Required**. |
| `lastName` | `string` | **Required**. |
| `email` | `string` | **Required**. |
| `password` | `string` | **Required**. |
| `role` | `string` | **Required**. |


| `images` | `files` | **Required**. |

#### Login

```http
  POST /api/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Required**. |
| `password`      | `string` | **Required**. |


#### Authenticated Client

```http
  GET /api/users/me
```

`Pass token inside the request header using`





## Running Tests

To run the tests, you will need to create `.env.test`at the root of this project, add the following environment variables.


`POSTGRES_HOST`

`POSTGRES_USER`

`POSTGRES_PASSWORD`

`POSTGRES_DB`

`POSTGRES_PORT`

`AWS_ACCESS_KEY_ID`

`AWS_SECRET_ACCESS_KEY`

`AWS_REGION`

`AWS_BUCKET_NAME`

`SALT_ROUNDS=10`

`JWT_SECRET`

`JWT_EXPIRES=1d`

Run tests

```bash
  npm run test
```

