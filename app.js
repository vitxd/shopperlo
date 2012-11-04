
/**
 * Module dependencies.
 */

var   express 	= require('express')
    , _			= require('underscore')
    , routes	= require('./models/router.js')
    , app		= module.exports = express.createServer()
	, MemoryStore = require('connect/lib/middleware/session/memory.js')
;


// Configuration

app.configure(function(){
    app.use(express.static(__dirname + '/public'));
    app.set('views', __dirname + '/views');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
//	app.use(express.cookieSession());
	app.use(express.cookieParser( 'asdiufhaisd7fh8asd6fg3645r34'));
	app.use(express.session({
		key: 'shopperlo-cookie',
		secret: 'asdiufhaisd7fh8asd6fg3645r34',
		store: new MemoryStore({ reapInterval: 60000 * 10 })
	}));
    app.use(app.router);
});

app.register('.html', {
    compile: function(str, options){
        var compiled = require('underscore').template(str);
        return function(locals) {
            return compiled(locals);
        };
    }
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes
app.get('/', routes.router);
app.post('/', routes.router)

app.get('/create-user', function(req, res){
	var   GroupSchema 	= require('./models/group.js').Group
		, UserSchema	= require('./models/user.js').User
		, user
		, group
		;

	UserSchema.find({username : req.param('username')}, function(err, result){
		if(result.length == 0){
			user = new UserSchema();
			user.username = req.param('username');
			user.password = req.param('password');
			user.email 	  = req.param('email');
			user.save();
		} else {
			user = result[0];
		}

		GroupSchema.findById(req.param('group'), function(err, result){
			if(result != null){
				result.users.push(user.id);
				result.save(function(err){
					if(err) console.log('mofo error: ' +err);
				});
				res.send('Done.');
			} else {
				res.send('Error. Group does not exist.');
			}
		})
	});
});

app.get('/create-group', function(req, res){
	var   GroupSchema 	= require('./models/group.js').Group
		, name 			= req.param('name')
		;
	console.log(name);
	GroupSchema.find({name : name}, function(err, group){
		if(group.length == 0){
			console.log('New group! ' +name);
			group = new GroupSchema({name : name});
			group.users = [];
			group.save(function(err){
				if(err) console.log(err);
			});
		}
		else
			group = group[0];
		res.send('Done. Id is: ' + group.id);
	});

});


app.listen(3000, function(){
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
