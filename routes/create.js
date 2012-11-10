var   GroupSchema 	= require('./../models/group.js').Group
	, UserSchema	= require('./../models/user.js').User
	;

exports.router = function(req, res, callback){

	console.log('Arguments: ' + arguments.length);
	console.log(arguments[2]);
	new CreateRouter(req, res);
//	callback();
};

CreateRouter = function(req, res){

	this.req = req;
	this.res = res;

	this.url = this.req.url.split('/');
	this.init();
};

CreateRouter.prototype.init = function(){
	if(this.url.length != 3)
		return this.error();


	var action = this.url[2].split('?')[0];
	console.log(action);
	switch(action){
		case 'group':
			return this.group();
			break;
		case 'user':
			return this.user();
			break;
		default:
			return this.error();
	}
};

CreateRouter.prototype.error = function(){
	this.res.render('error.html', {libraries: []});
};

CreateRouter.prototype.user = function(){
	var   user
		, group
		;

	try{
		user = new UserSchema();
		user.username = this.req.param('username');
		user.password = this.req.param('password');
		user.email 	  = this.req.param('email');

		GroupSchema.findById(this.req.param('group'), function(err, result){
			if(result == null){
				throw new Error('Group does not exist');
			}
			for(i in result.users){
				if(result.users[i].username == user.username){
					throw new Error('User exists');
				}
			}

			result.users.push(user);

			console.log(result);
			result.save(function(err){
				if(err) console.log('error saving group: ' + err);
			});
			this.res.send('Done.');
		}.bind(this))
	} catch (e){
		this.res.send('Error. ' + e.message);
	}
};


CreateRouter.prototype.group = function(){
	var name = this.req.param('name');

	console.log(name);
	GroupSchema.find({name : name}, function(err, group){
		if(group.length == 0){
			console.log('New group! ' +name);
			group = new GroupSchema({name : name});
			group.users = [];
			group.list 	= [];
			group.save(function(err){
				if(err) console.log(err);
			});
		}
		else
			group = group[0];
		this.res.send('Done. Id is: ' + group.id);
	}.bind(this));

};
