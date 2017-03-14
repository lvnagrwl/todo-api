var bcrypt = require('bcrypt');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function(sequelize, Datatypes) {
	var user = sequelize.define('user', {
		email: {
			type: Datatypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},

		salt: {
			type: Datatypes.STRING
		},

		password_hash: {
			type: Datatypes.STRING
		},

		password: {
			type: Datatypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [7, 100]
			},
			set: function(value) {
				var salt = bcrypt.genSaltSync(10); // 10 = number of characeters you need for salt
				var hashedPassword = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value); // set password = value
				this.setDataValue('salt', salt); // set salt = salt
				this.setDataValue('password_hash', hashedPassword);
			}

		}

	}, {
		hooks: {
			beforeValidate: function(user, options) {
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		},

		classMethods: {
              			authenticate: function(body) {
				return new Promise(function(resolve, reject) {
					if (typeof body.email !== 'string' || typeof body.password !== 'string') {
						return reject();
					}

					user.findOne({
						where: {
							email: body.email
						}
					}).then(function(user) {
						if (!user || !bcrypt.compareSync(body.password , user.get('password_hash'))) {
							return reject();
						}
						resolve(user);
					}, function(e) { 
						reject();
					});
				});
			
		},findByToken : function(token){
              	return new Promise(function(resolve , reject){
              		try{
                        var decodeJWT = jwt.verify(token , 'qwerty098');
                        var bytes = cryptojs.AES.decrypt(decodeJWT.token, 'abc123!23');
                        var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

                        user.findById(tokenData.id).then(function(user){
                            if(user){
                            	resolve(user);
                            }else{
                            	reject();   //if user does not exist
                            }         
                        } , function(e){
                        	reject();  // if id is not found because of db connectivity or else
                        });
              		}catch(e){
                             reject(); // try ctach faails 
              		}
              	});
              }
            },
	

		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'updatedAt', 'createdAt');
			},

			generateToken : function(type){
                   
                    if(!_.isString(type)){
                    	return undefined;
                    }

                    try{
                    	    //below line takes user id and type and convert into JSON string because
 							//AES.encrypt used in second line only knows to encrypt string
 							//stringData - secret Data , abc123! - secret password 
 							// toString returs our encrypted string

                    		var stringData = JSON.stringify({id : this.get('id') , type : type});
                    		var encryptedData = cryptojs.AES.encrypt(stringData , 'abc123!23').toString();
                    		    
                    		// When we get token back from the user we we'll be able to pull out token
                    		//proprty that's going to have the encrypted data, we can decrypt it and 
                    		//find the user by their id.
                    		var token = jwt.sign({
                    			token : encryptedData
                    		} , 'qwerty098');

                    		return token;
                    }catch(e){
                    	console.error(e);
                    	return undefined;
                    }
			}
		}

	});

	return user;
};