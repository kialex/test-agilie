# Agilie Test Task

The system to be developed is part of some fintech application. It supports the following
types of cryptocurrencies with their standard symbols. They are also used on mobile
clients so that only they should be used in all external interfaces, API requests, and
responses.

[![NestJS][nestjs-image]][nestjs-url]

## Requirements

Before starting, make sure you have at least those components on your workstation:
* Installed [Node.js][node-js-url] v18.10.0 or higher and up-to-date release of NPM;
* Installed up-to-date [Docker][docker-url];

## Quick start

Run docker to run PostgreSQL
```bash
docker-compose up
```

Install npm packages
```
npm install
```

Run DB migrations to create tables and init fake data.
```
npm run migration:run
```

Run project in dev mode and wait while all components will be loaded
```
npm run start:debug
```

## Configuration

You can change some settings in the `.env` file.

* `KRAKEN_WS_HOST` - Required. Kraken WS host which you wish;


## Test commands

```bash
# Get the exchange rate 
curl "http://localhost:3000/exchanger/rates?pairs=ETH/USD,XBT/USD,XBT/EUR"
```

Each
day at 00:00 the system calculates and stores the balance of each specific account.
You can change the cron datetime to test it at the path: `src/exchanger/exchanger.service.ts` at `38` line.

[node-js-url]: https://nodejs.org
[docker-url]: https://www.docker.com
[nestjs-url]: https://nestjs.com
[nestjs-image]: https://badgen.net/npm/v/@nestjs/core