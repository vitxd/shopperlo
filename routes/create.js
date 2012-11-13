var   GroupModel 	= require('./../models/group.js').Group
	, UserModel		= require('./../models/user.js').User
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
	var user;

	UserModel.find({username: this.req.param('username')}, function(err, result){
		if(result === undefined || result.length === 0){
			user = new UserModel();
			user.username = this.req.param('username');
			user.password = this.req.param('password');
			user.email 	  = this.req.param('email');
			console.log('new user');
		} else {
			user = result[0];
			console.log('old user');
		}

		console.log(user._id);

		GroupModel.findById(this.req.param('group'), function(err, group){
		try{
			if(group === null){
				console.log('Zio can');
				throw new Error('Group does not exist');
			}

			user.groups.push(group._id);
			group.users.push(user._id);
			user.save();
			group.save(function(err){
				if(err) console.log('error saving group: ' + err);
			});
			this.res.send('Done.');

		} catch(e) {
			this.res.send('Error. ' + e.message);
		}
		}.bind(this));
	}.bind(this));
};

CreateRouter.prototype.group = function(){
	var name = this.req.param('name');
	console.log('Creating group name: ' + name);

	GroupModel.find({name : name}, function(err, groups){
		try{
			if(groups.length == 0){
				group = new GroupModel({name : name});
				group.list 	= [];
				group.users = [];
				group.save(function(err){
					if(err) console.log(err);
				});
			}
			else{
				group = groups[0];
			}
			this.res.send('Done. Id is: ' + group.id);

		} catch(e){
			this.res.send('Error. ' + e.message);
		}
	}.bind(this));

};
