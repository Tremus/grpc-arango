const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// grpc stuff
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const taskProtoPath = path.join(__dirname, 'protos', 'tasks.proto');
const taskProtoDefinition = protoLoader.loadSync(taskProtoPath);
const taskPackageDefinition = grpc.loadPackageDefinition(taskProtoDefinition).tasks;
const client = new taskPackageDefinition.TasksService('localhost:50051', grpc.credentials.createInsecure());

// setup packages that don't come with express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* ROUTES */
const getBody = req => ({ ...req.params, ...req.body });
const callback = res => (err, data) => {
    if (err) {
        console.error(err);
        res.status(500);
        res.json('An unexpected error occurred.');
    } else {
        res.json(data);
    }
};

app.get('/tasks', (req, res) => {
    client.listTasks(getBody(req), callback(res));
});

app.post('/tasks', (req, res) => {
    client.postTask(getBody(req), callback(res));
});

app.get('/tasks/:_key', (req, res) => {
    client.getTask(getBody(req), callback(res));
});

app.listen(3000, () => {
    console.log('Express server running at http://localhost:3000');
});
