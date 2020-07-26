const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('grpc');

const taskProtoPath = path.join(__dirname, 'protos', 'tasks.proto');
const taskProtoDefinition = protoLoader.loadSync(taskProtoPath);
const taskPackageDefinition = grpc.loadPackageDefinition(taskProtoDefinition).tasks;

const { Database, aql } = require('arangojs');

// TODO think of a better password
const db = new Database({
    url: 'http://localhost:8529',
});
db.useDatabase('todo');
db.useBasicAuth('root', 'password');

const listTasks = (call, callback) => {
    const query = aql`
        LET tasks = (
            FOR t IN tasks
                LIMIT 10
                RETURN t
        )
        RETURN {tasks: tasks}
    `;
    db.query(query)
        .then(cursor => callback(null, cursor._result[0]))
        .catch(err => callback(err));
};

// TODO
const getTask = (call, callback) => {};
const createTask = (call, callback) => {};
const updateTask = (call, callback) => {};
const deleteTask = (call, callback) => {};

const main = () => {
    const server = new grpc.Server();
    server.addService(taskPackageDefinition.TasksService.service, {
        listTasks,
        getTask,
        createTask,
        updateTask,
        deleteTask,
    });
    server.bind('localhost:50051', grpc.ServerCredentials.createInsecure());
    server.start();
    console.log('gRPC server running at http://localhost:50051');
};

main();
