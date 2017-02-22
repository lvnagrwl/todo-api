var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [
{
   id: 1,
   descritpion: 'Meet mom for lunch',
   completed:false
},
{
	id: 2 , 
	descritpion: 'Go to market',
	completed: false
},
{
	id: 3,
	description: 'back to Home',
	completed: true
}
];

app.get('/' , function(req , res){

	res.send('To-Do Api root');
});

//GET /todo
app.get('/todos' , function(req , res){
	res.json(todos);
});

//GET /todo:id
app.get('/todos/:id' , function(req , res){

	var todoId = parseInt(req.params.id);
	var matchedId;

	todos.forEach(function(todo){
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

app.listen(PORT , function(){
	console.log('Express listening on ' + PORT +'!');
});