# Getting started

- Node >= 12
- yarn install
- Export Environment Variables as listed below
- yarn start

## Environment Variables

Must export some environment variables to start app correctly.
Variable|Reason|
--------|-------|
DB_PASSWORD|Password for database connection|
HOT_WALLET_SEED|Mnemonic for Hot Wallet|
GITHUB_SECRET|Secret value for github verifications|
JWT_SECRET|Strong JWT Secret if needed|
MAXMIND_LICENSE_KEY|Maxmind license key|
NODE_ENV|Export Development/Production.|

# Docker Image

## Building Docker Image

* Install dependencies `yarn install
* Build source `yarn build`.
* Build docker image with `docker build -t <repo_name>/substrate-authn-faucet-backend .`

## Running Docker Image

To run docker image pass environment variables and volume mount for Sqlite database. you can also change image tag.

`docker run -e "NODE_ENV=production" -e "DB_PASSWORD=password" -e "HOT_WALLET_SEED=my seed phrase" -e "GITHUB_SECRET=github secret" -e "MAXMIND_LICENSE_KEY=key" -it -p 8080:8080 -v /local/path/location:/data <repo_name>/substrate-authn-faucet-backend`

# DB Setup

Understand how configs work. Env vars take priority over supplied vars in config/config.js

## Creating models

```
npm run db:model:generate -- --name users --attributes is_deleted:boolean
// `db:model:generate` is an alias for `sequelize model:generate`,
// more documentation can be found at https://sequelize.org/master/manual/migrations.html

```

## Generating Migrations

```
npm run db:migration:generate -- --name name-of-migration
// `db:migration:generate` is an alias for `sequelize migration:generate`
// more documentation can be found at https://sequelize.org/master/manual/migrations.html
```

## Running migrations

```
npm run db:migrate
// `db:migrate` is an alias for `sequelize db:migrate`
// more documentation can be found at https://sequelize.org/master/manual/migrations.html
```

See package.json for more useful commands starting with _db:_

## Updating models

It's a two step process.

### Update model

- Go to 'src/models'
- Change model file

### Migrations

#### Create Migration

- Init sequelize, with sequelize-cli, using sequelize init
- Create your models
- Create initial migration - run:
- > node ./node_modules/sequelize-auto-migrations/bin/makemigration --name <migrationname>
- Change models and run it again, model difference will be saved to the next migration
- To preview new migration, without any changes, you can run:
- > node ./node_modules/sequelize-auto-migrations/bin/makemigration --preview

#### Execute(Run) Migration

- There is simple command to perform all created migrations (from selected revision):
- > node ./node_modules/sequelize-auto-migrations/bin/runmigration
- To select a revision, use --rev <x>
- > node ./node_modules/sequelize-auto-migrations/bin/runmigration --rev 1
- If migration fails, you can continue, use --pos <x>
- To prevent execution next migrations, use --one

Change models and run it again, model difference will be saved to the next migration
To preview new migration, without any changes, you can run:

makemigration --preview

makemigration tool creates \_current.json file in migrations dir, that is used to calculate difference to the next migration. Do not remove it!

# Running & Debug

To run the app
`yarn run start` works.

To debug

- Go to Debug panel in VS Code
- Select 'Debug' in dropdown
- Click Run icon. Should see 'debuger connected'

# APIs

Only available in development

## Direct Access

Go to localhost:8080/api-docs

## Postman Usage

- Go to localhost:8080/api-spec and save the file as JSON.
- Import file in Postman

## Directory Layout

```bash
.
├── /build/                     # The compiled output (via Babel)
├── /migrations/                # Database schema migrations
├── /seeds/                     # Scripts with reference/sample data
├── /src/                       # Node.js application source files
│   ├── /emails/                # Handlebar templates for sending transactional email
│   ├── /routes/                # Express routes, e.g. /login/facebook
│   ├── /schema/                # GraphQL schema type definitions
│   ├── /utils/                 # Utility functions (mapTo, mapToMany etc.)
│   ├── /app.js                 # Express.js application
│   ├── /Context.js             # Data loaders and other context-specific stuff
│   ├── /db.js                  # Database access and connection pooling (via Knex)
│   ├── /email.js               # Client utility for sending transactional email
│   ├── /errors.js              # Custom errors and error reporting
│   ├── /passport.js            # Passport.js authentication strategies
│   ├── /redis.js               # Redis client
│   ├── /server.js              # Node.js server (entry point)
│   └── /types.js               # Flow type definitions
├── /tools/                     # Build automation scripts and utilities
├── docker-compose.yml          # Defines Docker services, networks and volumes
├── docker-compose.override.yml # Overrides per developer environment (not under source control)
├── Dockerfile                  # Commands for building a Docker image for production
├── package.json                # List of project dependencies
└── postgres-initdb.sh          # Configuration script for the PostgreSQL Docker container
```
