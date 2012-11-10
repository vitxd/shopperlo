
var User = require('./../models/user.js').User,
	data = false;

/*
 * GET home page.
 */

exports.router = function(req, res){
	new Router(req, res);
};

var Router = function(req, res){

    this.req		= req;
    this.res		= res;

	this.method 	= req.method;
	this.session 	= req.session;

	this.post		= req.body;

	console.log(this.session.userId);

    this.init();
};

Router.prototype.isPost = function(){
	return (this.method == 'POST');
};

Router.prototype.isLogged = function(){
	return (this.session.userId != undefined);
};

Router.prototype.init = function(){
	if(this.isLogged()){
		this.setUser();
		this.index();
	}
	else{
		if(this.isPost())
			this.doLogin();
		else
			this.login(false);
	}

};

Router.prototype.setUser = function(){
	this.user = new User({_id : this.getUserId()});
};

Router.prototype.index = function(){
	user = this.getUser(function(err, user){
		user.getGroups(function(results){
			this.res.render('index.html', { title: 'Index', groups : results, libraries : [] });
		}.bind(this));
	}.bind(this));

	console.log(user.username);

};

Router.prototype.getUser = function(callback, chk){

	if(chk === undefined){
		User.findById(this.getUserId(), function(err, result){
			data = result;
		});
	}

	if(!data){
		return this.getUser(null, true);
	}

	return data;
};

Router.prototype.about = function(){
    this.res.render('index', { title: 'About' })
};

Router.prototype.login = function(err){
	this.res.render('login.html', { error: err, libraries : [ 'login.js' ] } );
};


Router.prototype.getUserId = function(){
	return this.session.userId;
};

Router.prototype.doLogin = function(){
	console.log('Login!');
	console.log(this.post);

	User.find({username: this.post.username}, function(err, result){

		try{
			if(result[0].authenticate(this.post.password)){
				this.session.userId = result[0].id;
				this.index();
			}
			else
				throw 'error';
		} catch (err) {
			console.log(err);
			this.login(true);
		}
	}.bind(this));



};