var express = require('express');
var body_parser = require('body-parser');
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;
var todo = [];
var todoNextId = 1;
var db = require('./db.js');   //calls db.js file

app.use(body_parser.json());

app.get('/', function(req, res) {
	res.send('Starting app with underscore');
});

//GET todos?completed=true
app.get('/todos', function(req, res) {

	var queryParams = req.query;
	var filteredTodo = todo;

	if (queryParams.hasOwnProperty('Completed') && queryParams.Completed == 'true') {

		filteredTodo = _.where(filteredTodo, {
			Completed: true
		});
	} else if (queryParams.hasOwnProperty('Completed') && queryParams.Completed == 'false') {
		filteredTodo = _.where(filteredTodo, {
			Completed: false
		});
	}

	res.json(filteredTodo);
});

app.get('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id);

	db.todo.findById(todoId).then(function(todo){
      
      if(todo){
      	res.json(todo.toJSON());
      }else{
      	res.status(404).json();
      }

	}, function(e){
        res.status(500).json(e);
	});
	// var matchedId = _.findWhere(todo, {
	// 	id: todoId
	// });

	// if (matchedId) {
	// 	res.json(matchedId);
	// } else {
	// 	res.status(404).send();
	// }
});

app.post('/todos', function(req, res) {

	var body = _.pick(req.body, 'Description', 'Completed');

	db.todo.create(body).then(function(todo){
		res.json(todo.toJSON());
	} , function(e){
		res.status(404).json(e);
	})

	// if (!_.isBoolean(body.Completed) || !_.isString(body.Description) || body.Description.trim().length === 0) {

	// 	return res.status(400).send();
	// }

	// body.Description = body.Description.trim();

	// body.id = todoNextId++;
	// todo.push(body);

	// res.json(body);
});

app.delete('/todos/:id', function(req, res) {

	var todoId = parseInt(req.params.id);
	var matchedId = _.findWhere(todo, {
		id: todoId
	});

	if (!matchedId) {
		res.status(404).json({
			"error": "No data found with ID"
		});
	} else {
		todo = _.without(todo, matchedId);
		res.json(matchedId);
	}

});
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id);
	var matchedId = _.findWhere(todo, {
		id: todoId
	});
	var body = _.pick(req.body, 'Description', 'Completed');
	var validAttribute = {};

	if (!matchedId) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('Completed') && _.isBoolean(body.Completed)) {

		validAttribute.Completed = body.Completed;
	} else if (body.hasOwnProperty('Completed')) {
		return res.status(404).send();

	}

	if (body.hasOwnProperty('Description') && _.isString(body.Completed) && body.Description.trim().length > 0) {
		validAttribute.Description = body.Description;

	} else if (body.hasOwnProperty('Description')) {
		return res.status(404).send();
	}

	_.extend(matchedId, validAttribute);
	res.json(matchedId);
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening at ' + PORT + '!');
	});
});