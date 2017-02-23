var express = require('express');
var bodyPareser =require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todo = [];
var todoNext = 1;

app.use(bodyPareser.json());


app.get('/' , function(req , res){
    
    res.send('todo Api app started');

});

app.get('/todos' , function(req , res){
	res.json(todo);
});

app.get('/todos/:id' , function(req , res){
    
    todoId = parseInt(req.params.id);
    var matchedtodo ;

    todo.forEach(function(todo){
        
        if(todoId === todo.id){
        	matchedtodo = todo
        }

     });
    if(matchedtodo){
        	res.json(matchedtodo)
        }else{
        	res.status(404).send();
        }
});

//POST /todos{}

app.post('/todos' , function(req , res){
   var body = req.body;

   body.id = todoNext++;
   todo.push(body);

   console.log('Description:' + body.description);
   res.json(body);
});

app.listen(PORT , function(){
	console.log('Express listening at Port ' +PORT + '!');
})