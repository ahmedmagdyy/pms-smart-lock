# Smart lock

NodeJS server to add smart-lock support to an existing PMS.

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