module.exports = function(sequelize , Datatypes){
	return sequelize.define('todo' , {
   
      Description: {
    type: Datatypes.STRING,
    allowNull : false,
    validate : {
    	len: [1,250]
    }
   },
   Completed: {
   	type: Datatypes.BOOLEAN,
   	allowNull:false,
   	defaultValue: false
   }

 });
};