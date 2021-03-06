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
docker exec -it app npm run db:seed
```

### Check queries without specific indexes

---

```
docker exec -it app npm run benchmark
```

### Add specific indexes to speed up our queries

---

```
docker exec -it app npm run db:indexes:init
```

### Check queries with specific indexes

---

```
docker exec -it app npm run benchmark
```
