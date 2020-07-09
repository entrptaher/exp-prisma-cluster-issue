### Starting server

Create a .env file with following variable for postgresql server,

```sh
DATABASE_URL="postgresql://user:password@localhost:5432/database?schema=public"
```

Start the postgresql,
```sh
docker-compose up
```

Install and generate everything else,
```sh
yarn
yarn prisma migrate save --experimental
yarn prisma migrate up --experimental
yarn prisma generate
```

Start the api, which will create two api, one with cluster at 3000, one without cluster 3001,

```sh
yarn start
```

### Create new text

here we are using the loadtest module to create 1000 requests at once with 100kb string (total 100mb thoughtput),
```sh
# to cluster
yarn loadtest -c 10 --rps 1000 http://localhost:3000/create\?length\=100000

# to non-cluster
yarn loadtest -c 10 --rps 1000 http://localhost:3001/create\?length\=100000
```

You will get the process id and post id as response,

```json
{"pid":44870,"id":1,"total":7792}
```

### Read the text
```sh
# to cluster
yarn loadtest -c 10 --rps 100 http://localhost:3000/read?id=1

# to non-cluster
yarn loadtest -c 10 --rps 100 http://localhost:3001/read?id=1
```

### Get total count
```sh
# to cluster
yarn loadtest -c 10 --rps 100 http://localhost:3000/read

# to non-cluster
yarn loadtest -c 10 --rps 100 http://localhost:3001/read
```