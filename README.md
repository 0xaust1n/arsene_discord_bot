# Arsene Discord Bot

This is a Discord bot built with Node.js and discord.js.

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Docker](https://docs.docker.com/get-docker/) (for containerized deployment)
*   [Node.js](https://nodejs.org/) (version 22 or higher, for local development)
*   [Yarn](https://classic.yarnpkg.com/en/docs/install/) (for local development)

## Setup

### Environment Variables

This project uses environment variables for sensitive information. Create a `.env` file in the root directory of the project, based on the provided `.env.example`.

Example `.env` file:

```dotenv
TOKEN=YOUR_BOT_TOKEN
CLIENTID=YOUR_BOT_CLIENT_ID
GUILDID=YOUR_GUILD_ID
FIREBASE={YOUR_FIREBASE_AUTH_OBJECT}
```

*   `TOKEN`: Your Discord bot token.
*   `CLIENTID`: The client ID of your Discord application.
*   `GUILDID`: The ID of the Discord server (guild) where you want to deploy slash commands.
*   `FIREBASE`: Your Firebase authentication object (JSON format).

## Running with Docker

### 1. Build the Docker Image

Navigate to the root directory of the project where the `Dockerfile` is located and run the following command to build the Docker image:

```bash
docker build -t arsene-bot .
```

This command builds an image named `arsene-bot` from your current directory.

### 2. Run the Docker Container

Once the image is built, you can run a container from it. Make sure your `.env` file is properly configured.

```bash
docker run -d --name arsene-bot-container --env-file ./.env arsene-bot
```

*   `-d`: Runs the container in detached mode (in the background).
*   `--name arsene-bot-container`: Assigns a name to your container for easier management.
*   `--env-file ./.env`: Mounts your local `.env` file into the container, making environment variables available to the application.
*   `arsene-bot`: The name of the Docker image to use.

You can check the container logs to ensure it's running correctly:

```bash
docker logs arsene-bot-container
```

To stop the container:

```bash
docker stop arsene-bot-container
```

To remove the container:

```bash
docker rm arsene-bot-container
```

## Local Development (Optional)

If you prefer to run the bot directly on your machine without Docker:

### 1. Install Dependencies

```bash
yarn install
```

### 2. Run the Bot

```bash
yarn dev
```

This will start the bot using `node src/app.js`.

## Deploying Slash Commands (Optional)

To register your bot's slash commands with Discord, you can use the deploy script. This also requires your `.env` file to be correctly set up with `TOKEN`, `CLIENTID`, and `GUILDID`.

```bash
yarn deploy
```
