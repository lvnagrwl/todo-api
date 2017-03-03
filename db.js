var Sequelize = require('Sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if(env === 'production'){
	sequelize = new Sequelize(process.env.DATABASE_URL , {

		dialect:'postgres',
		dialectOptions: {
        ssl: true
    }
	});
}else{
	 sequelize = new Sequelize(undefined , undefined , undefined , {
	'dialect' : 'sqlite',
	'storage' : __dirname + '/data/dev-todo-api.sqlite'
});

}


var db = {};

db.todo = sequelize.import( __dirname + '/models/todo.js') // loads newly created database in new todo model
db.sequelize = sequelize;
db.Sequelize = Sequelize;

//exports db object which contains todo model , sequelize instance and Sequelize libraray
module.exports = db;