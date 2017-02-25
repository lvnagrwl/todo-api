var express = require('express');
var body_parser = require('body-parser');
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;
var todo=[];
var todoNextId = 1;

app.use(body_parser.json());

app.get('/' , function(req , res){
	res.send('Starting app with underscore');
});

app.get('/todos' , function(req , res){
	res.json(todo);
});

app.get('/todos/:id' , function(req , res) {
    
    var todoId =parseInt(req.params.id);
    var matchedId = _.findWhere(todo , {id : todoId});
    
    if(matchedId){
    	res.json(matchedId);
    }else{
    	res.status(404).send();
    }
});

app.post('/todos' , function(req , res){
    
    var body = _.pick(req.body , 'Description' , 'Completed');

    if(!_.isBoolean(body.Completed) || !_.isString(body.Description) || body.Description.trim().length=== 0){
    	 
    	return res.status(400).send();
    }

    body.Description = body.Description.trim();

    body.id = todoNextId++;
    todo.push(body);

    res.json(body);
});

app.listen(PORT , function(){
   console.log('Express listening at ' +PORT + '!');
});