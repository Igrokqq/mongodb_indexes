# Mongodb Optimization with indexes

## Prepare Infrastructure
### Create docker volume for the database
```
docker volume create --name my_mongodb_data -d local
```
### Run docker-compose containers
```
docker-compose up -d
```

## Benchmark
### Seed data
---
```
npm run db:seed
```

### Check queries without specific indexes
---
```
npm start
```

### Add specific indexes to speed up our queries
---
```
npm run db:indexes:init
```

### Check queries with specific indexes
---

```
npm start
```