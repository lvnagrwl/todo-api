var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize , Datatypes){
       return sequelize.define('user' , {
       	email:{
       		type : Datatypes.STRING,
       		allowNull : false,
       		unique : true,
       		validate:{
       			isEmail : true
          	} 
          },

       	salt:{
       		type : Datatypes.STRING
       	},

       	password_hash : {
       		type : Datatypes.STRING
       	},

       	password : {
       		type : Datatypes.VIRTUAL,
       		allowNull : false,
       		validate : {
                len : [7 , 100]       
           	} , 
       	set: function(value){
       		var salt = bcrypt.genSaltSync(10); // 10 = number of characeters you need for salt
       		var hashedPassword = bcrypt.hashSync(value , salt);

       		this.setDataValue('password' , value);   // set password = value
       		this.setDataValue('salt' , salt);       // set salt = salt
       		this.setDataValue('password_hash' , hashedPassword);
       	}

      } 

  }, {           
      	hooks:{
       			 beforeValidate:function(user , options){
       			if(typeof user.email === 'string'){
       				user.email = user.email.toLowerCase();
       			}
       		   }
       		},

       		instanceMethods : {
                 toPublicJSON : function () {
                 	var json = this.toJSON();
                 	return _.pick(json , 'id', 'email' , 'updatedAt' , 'createdAt');
                 }
       		}
       	
       });
};