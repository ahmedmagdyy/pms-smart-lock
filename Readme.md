# Smart lock

NodeJS server to add smart-lock support to an existing PMS (Property management system), Server uses [Tuya](https://www.tuya.com/) API to generate access code.

## Installation

Make sure you have [NodeJS](https://nodejs.org/en/) and [PostgreSQL](https://www.postgresql.org/download/) installed.

## How to run the server.

#### Clone repo.

#### Create .env file based on .env.example file included.

#### Install Dependencies:
```bash
npm i
```

#### Apply [Prisma](https://www.prisma.io/) migrations, run:
```bash
yarn prisma-gen
```
or
```bash
npm run prisma-gen
```

#### Run server:
```bash
yarn dev
```
or
```bash
npm run dev
```

## License
[MIT](https://choosealicense.com/licenses/mit/)