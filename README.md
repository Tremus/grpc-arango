# grpc-arango
Test project using gRPC, ArangoDB and ExpressJS

### Usage
```shell
curl 'http://localhost:3000/tasks'
curl 'http://localhost:3000/tasks/{{KEY}}'
curl -X POST -H 'Content-Type: application/json' -d "{\"title\": \"Posted from cURL\"}" 'http://localhost:3000/tasks'
curl -X PUT -H 'Content-Type: application/json' -d "{\"description\": \"PUT from cURL\"}" 'http://localhost:3000/tasks/{{KEY}}'
curl -X DELETE 'http://localhost:3000/tasks/{{KEY}}'
```
