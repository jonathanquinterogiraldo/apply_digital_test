<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# How to Initialize the APP

1. You must clone the repo and create a new file in root directory named ".env" and then paste environment variables which shared with you through the email.

2. It is necessary to compile with docker compose, before this you must have previously installed docker.

```bash
$docker-compose build
$docker-compose up
```

3. If you want to check the status of the redis and postgres data bases make a request to the following endpoint

```bash
GET http://localhost:3000/health
```

4. When the project is ready, you will need to populate database for first time, there are two options, first one is to trigger a manually population from API or the second one if API is not available populate with mock data from json file stored in the app with path src/data/mock-products

```bash
Manually population from Contentful API
POST http://localhost:3000/products/populate

Manualy population mock data
POST http://localhost:3000/products/populate
```

5. At this point having mock data stored, you will be able to perform searches using different filters such as page, limit, brand, name, minPrice, maxPrice, stock, color, currency, sku, id

```bash
GET http://localhost:3000/products
```

6. If you want to remove some product entry from the database you should go to the following endpoint and send the id product

```bash
DELETE http://localhost:3000/products/{id}
```

7. In order to go through the private reports module you will need to register a new user. 

```bash
POST http://localhost:3000/users/register

example 
{
  "username": "jonathanquinterogiraldo",
  "email": "jonathan@example.com",
  "password": "Aa123456*"
}
```
7. Once you have a new user registered you will be able to login and get a valid authentication token thus send it through the authorization headers

```bash
POST http://localhost:3000/auth/login
```

8. Finally having an authentication token you will be able to shoot request to the different reports

```bash
GET http://localhost:3000/reports/deleted-percentage
GET http://localhost:3000/reports/with-or-without-price
GET http://localhost:3000/reports/top-brand-percentage
```

NOTES: 
-The API is completely documented through swagger using "http://localhost:3000/api/docs"
-The strategy selected in terms of only save new products every hour from contenful API is using redis to compare which products are already stored in postgres
-Stack used: NodeJS, NestJs, Typescript, Jest, TypeORM, Class-Validator, Postgres, Redis, Swagger, ESLint, Prettier, Docker, Github, JWT, Terminus, PassportJS
-Extra features:
Redis to avoid querying data base in order to improve performance
Health endpoint to check databases status
Exception Filter in order to return a standard errors response
Population from json file in case API is not available
Validation if user send "Price" as search parameter
Validation is user send a max value for limit pagination
Unit test coverage upper than 70%


# Personal Contact

Note: If you have any question, do not hesitate reach out me.

Cellphone +57 3128672755
email: jonathan.quintero2657@gmail.com
