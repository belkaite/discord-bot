# TDD Discord bot with REST API

This project is a Discord bot (more precisely - CatBot ), built using node.js, REST API, Kysely based database system to automate sending of congratulatory messages when users complete sprints. Giphy API is integrated as well to send celebratory GIFs along the messages.

<img src="cat-bot.png" alt="CatBot" width="300"/>

## Supported endpoints

- POST /messages - send a congratulatory message to a user on Discord
- GET /messages - get a list of all congratulatory messages
- GET /messages?username={username} - get a list of all congratulatory messages for a specific user
- GET /messages?sprint={sprintCode} - get a list of all congratulatory messages for a specific sprint
- CRUD /templates - POST/GET/PATCH/DELETE endpoints for managing congratulatory message templates
- CRUD /sprints - POST/GET/PATCH/DELETE endpoints for managing sprints

Additionally created:
- GET /users - get a list of all users
- GET /users/{:username} = get users by username
- POST /users - create a new user

## Set up

Environtment variables needed:
DATABASE_URL - path to the database
DISCORD_BOT_TOKEN - authentication token for Discord bot
PORT - port number on which your application will run
CHANNEL_ID - ID of the Discord channel where your bot will send messages
GIPHY_API_KEY - API key for accessing Giphy's AP


## Migrations

Before running the migrations, we need to create a database. We can do this by running the following command:

```bash
npm run migrate:latest
```

## Running the server

In development mode:

```bash
npm run dev
```

In production mode:

```bash
npm run start
```
## Running the tests

In development mode:

```bash
npm run test
```
## Running tests coverage

In development mode:

```bash
npm run coverage
```

## Updating types

If you make changes to the database schema, you will need to update the types. You can do this by running the following command:

```bash
npm run gen:types
```
## Creating migration file


```bash
npm run generate-migration {migration name}
```


