
var   GroupModel 	= require('./../models/group.js').Group
	, UserModel 	= require('./../models/user.js').User
	, View 			= require('./../utility/view.js')
	;

/*
 * GET home page.
 */

exports.router = function(req, res){
	new Router(req, res);
};

var Router = function(req, res){

    this.req		= req;
    this.res		= res;

	this.view 		= new View(res);

	this.method 	= req.method;
	this.session 	= req.session;

	this.post		= req.body;

    this.init();
	this.close();
};

Router.prototype.isPost = function(){
	return (this.method == 'POST');
};

Router.prototype.isLogged = function(){
	return (typeof this.session.user === 'object');
};

Router.prototype.init = function(){
	if(this.isLogged()){
		this.index();
	}
	else{
		if(this.isPost())
			this.doLogin();
		else
			this.login(false);
	}
};

Router.prototype.setUser = function(user){
	this.session.user 	= user;
};

Router.prototype.index = function(){
	if(!this.isLogged())
		return this.login();

	this.view
		.set('groups', this.session.groups)
		.display('index.html');
};

Router.prototype.getUser = function(){
	return this.session.user;
};

Router.prototype.login = function(err){
	if(this.isLogged())
		return this.index();

	this.view
		.addLibrary('login.js')
		.set('error', err)
		.display('login.html')
};

Router.prototype.setGroups = function(groups){
	this.session.groups = groups;
	return this;
};

Router.prototype.doLogin = function(){

	UserModel
		.findOne({username : this.post.username})
		.populate('groups', 'name groups')
		.exec(function(err, user){
			try{

				if(err) throw new Error(err);
				if(user === null) {
					console.log('User is null: ');
					console.log(user);
					throw new Error('User does not exist');
				}

				if(user.authenticate(this.post.password)){
					this.setUser(user);
					this.setGroups(user.groups);
					this.index();
				}
				else
					throw new Error('Wrong password');

			} catch (err) {
				console.log('Exception caught: ' + err.message);
				this.login(true);
			}
	}.bind(this));



};

Router.prototype.close = function(){
	this.session.save();
}