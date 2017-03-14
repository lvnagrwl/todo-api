module.exports = function(db){

	return {
         
         //requqireAuthentication is going to check for existing token and decrypt the token and get userid and type out of the token.
         requireAuthentication : function(req , res , next){

         	var token = req.get('Auth');
            db.user.findByToken(token).then(function(user){
               req.user = user;
               next();
            } , function(){
              res.status(401).send();
            });

         }
	};
}