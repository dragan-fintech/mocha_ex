// Loading modules
const express = require('express');  
const lowdb = require('lowdb');  
const FileSync = require('lowdb/adapters/FileSync')
const uuid = require('uuid');  
const bodyParser = require('body-parser');  

// Instantiating express module
var app = express();  

// Instantiating database module
// This will create db.json storage in the root folder
const adapter = new FileSync('db.json')
app.db = lowdb(adapter)

// Adding body-parser middleware to parser JSON data
app.use(bodyParser.json());  

// CRUD routes to manage a task list

// Listing all tasks
app.get('/tasks', function(req, res) {  
    return res.json(app.db.get('tasks'));
});

// Finding a task
app.get('/tasks/:id', function(req, res) {  
    var id = req.params.id;
    var task = app.db('tasks').find({
        id: id
    });
    if (task) {
        return res.json(task);
    }
    return res.status(404).end();
});

// Adding new task
app.post('/tasks', function(req, res) {  
    var task = req.body;
    task.id = uuid();
    app.db('tasks').push(task)
    return res.status(201).end();
});

// Updating a task
app.put('/tasks/:id', function(req, res) {
    var id = req.params.id;
    var task = req.body;
    app.db('tasks')
        .chain()
        .find({
            id: id
        })
        .assign(task)
        .value()
    return res.status(201).end();
});

// Delete a task
app.delete('/tasks/:id', function(req, res) {
    var id = req.params.id;
    app.db('tasks').remove({
        id: id
    });
    return res.status(201).end();
});

// API server listing port 3000
app.listen(3000, function() {  
    console.log('API up and running');
});

// Exporting the app module
module.exports = app;
