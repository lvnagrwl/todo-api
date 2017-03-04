// var express = require('express');
// var app = express();
// var PORT = process.env.PORT || 3000;

// var todos = [
// {
//    id: 1,
//    descritpion: 'Meet ben for lunch',
//    completed:false
// },
// {
// 	id: 2 , 
// 	descritpion: 'Go to market',
// 	completed: false
// },
// {
// 	id: 3,
// 	description: 'back to Home',
// 	completed: true
// }
// ];

// app.get('/' , function(req , res){

// 	res.send('To-Do Api root');
// });

// //GET /todo
// app.get('/todos' , function(req , res){
// 	res.json(todos);
// });

// //GET /todo:id
// app.get('/todos/:id' , function(req , res){

// 	var todoId = parseInt(req.params.id);
// 	var matchedId;

// 	todos.forEach(function(todo){
// 		if(todoId === todo.id){
// 			matchedId = todo;			
// 		}

// 		}); 

// 		if(matchedId){
// 			res.json(matchedId);
// 		}else{
// 			res.status(404).send();
// 		}
	  
   
// });

// app.listen(PORT , function(){
// 	console.log('Express listening on ' + PORT +'!');
// });


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
	var where = {};

	if (queryParams.hasOwnProperty('Completed') && queryParams.Completed == 'true') {

		     where.Completed = true
		
	} else if (queryParams.hasOwnProperty('Completed') && queryParams.Completed == 'false') {
		
			 where.Completed = false
	}

	if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
		where.Description = {

			$like: '%' + queryParams.q + '%'

		};
	}

	db.todo.findAll({where: where}).then(function (todos){
       
       res.json(todos);

	} , function (e){
		res.status(404).send();
	});
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
	
	db.todo.destroy({

		where:{
			id: todoId
		}
	}).then(function(numberOfRowsDeleted){
       
       if(numberOfRowsDeleted === 0){
       	   res.status(404).json({
       	   	"error":"No rows to be deleted"
       	   });
       }else{
       	res.status(504).send();
       }
	} , function(){
		res.status(500).send();
	});

	// var matchedId = _.findWhere(todo, {
	// 	id: todoId
	// });

	// if (!matchedId) {
	// 	res.status(404).json({
	// 		"error": "No data found with ID"
	// 	});
	// } else {
	// 	todo = _.without(todo, matchedId);
	// 	res.json(matchedId);
	// }

});
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id);
	// var matchedId = _.findWhere(todo, {
	// 	id: todoId
	// });
	var body = _.pick(req.body, 'Description', 'Completed');
	var attributes = {};
        
    if(body.hasOwnProperty('Completed')){
    	attributes.Completed = body.Completed;
    }

    if(body.hasOwnProperty('Description')){
    	attributes.Description = body.Description;
    }

   db.todo.findById(todoId).then(function(todo){

   	   if(todo){
   	   	return todo.update(attributes).then(function(todo){
       
       res.json(todo.toJSON());
   } , function(e){
   	      res.status(400).json(e);
   });
   	   }else{
   	   	res.status(404).send();
   	   }
   	  },function(){
           res.status(500).send();
      });
	// if (!matchedId) {
	// 	return res.status(404).send();
	// }

	// if (body.hasOwnProperty('Completed') && _.isBoolean(body.Completed)) {

	// 	validAttribute.Completed = body.Completed;
	// } else if (body.hasOwnProperty('Completed')) {
	// 	return res.status(404).send();

	// }

	// if (body.hasOwnProperty('Description') && _.isString(body.Completed) && body.Description.trim().length > 0) {
	// 	validAttribute.Description = body.Description;

	// } else if (body.hasOwnProperty('Description')) {
	// 	return res.status(404).send();
	// }

	// _.extend(matchedId, validAttribute);
	// res.json(matchedId);
});


app.post('/users' , function(req , res){
     
     var body = _.pick(req.body , 'email' , 'password');

    db.user.create(body).then(function (user){
    	res.json(user.toJSON());
    } , function(e){
    	res.status(404).json(e);
    });
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening at ' + PORT + '!');
	});
});