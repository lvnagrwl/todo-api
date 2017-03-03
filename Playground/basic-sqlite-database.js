var Sequelize = require('Sequelize');
var sequelize = new Sequelize(undefined , undefined , undefined , {

	'dialect' : 'sqlite',
	'storage' : __dirname + '/basic-sqlite-database.sqlite' 
});

 var Todo = sequelize.define('todo' , {
   
      Description: {
    type: Sequelize.STRING,
    allowNull : false,
    validate : {
    	len: [1,250]
    }
   },
   Completed: {
   	type: Sequelize.BOOLEAN,
   	allowNull:false,
   	defaultValue: false
   }

 });

sequelize.sync({
	//force: true //adds a DROP TABLE IF EXISTS
}).then(function () {
   console.log('Everything is synced');

    Todo.findById(2).then(function(todo){
    	
    		if(todo){
    			console.log(todo.toJSON());
    		}else{
    			console.log('Todo not found');
    		  	}
    });
   //  Todo.create({
   // 	Description: 'Hello',
   // 	}).then(function(todo){
   // 	   return Todo.create({
   // 	   	Description: 'People'
   // 	   });
   // }).then(function(){
   //    // return Todo.findById(1);

   //    return Todo.findAll({
   //    	where:{
   //    		Description: {
   //    			$like: '%Peop%'
   //    		}
   //    	}
   //    });
   // }).then(function(todos){
   // 	if(todos){
   // 		todos.forEach(function(todo){
   // 			console.log(todo.toJSON());
   // 		});
   // 	}else{
   // 		console.log('No such value');
   // 	}
   // })
   // 	.catch(function(e){
   // 	console.log(e);
   // });
});

