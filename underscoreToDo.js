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
    var matchedId;

    todo.forEach(function(todo){
    	if(todoId === todo.id){
    		matchedId = todo;
    	}
    });

    if(matchedId){
    	res.json(matchedId);
    }else{
    	res.status(404).send();
    }
});

app.post('/todos' , function(req , res){
    
    var body = req.body;

    body.id = todoNextId++;
    todo.push(body);

    res.json(body);
});

app.listen(PORT , function(){
   console.log('Express listening at ' +PORT + '!');
});